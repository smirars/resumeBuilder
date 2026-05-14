import requests as http_requests
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm.attributes import flag_modified

from ..config import settings
from ..models.resume import Resume
from ..database import SessionLocal

router = APIRouter(prefix="/api/hh", tags=["hh"])

_REDIRECT_URI = "http://localhost:8000/api/hh/callback"
_HH_AUTH_URL = "https://hh.ru/oauth/authorize"
_HH_TOKEN_URL = "https://hh.ru/oauth/token"
_HH_API = "https://api.hh.ru"
_HEADERS = {"User-Agent": "ResumeBuilder/1.0 (student project)"}


@router.get("/auth-url")
def get_auth_url(resume_id: str):
    if not settings.HH_CLIENT_ID:
        raise HTTPException(status_code=400, detail="HH_CLIENT_ID не задан в .env")
    url = (
        f"{_HH_AUTH_URL}?response_type=code"
        f"&client_id={settings.HH_CLIENT_ID}"
        f"&redirect_uri={_REDIRECT_URI}"
        f"&state={resume_id}"
    )
    return {"url": url}


@router.get("/callback")
def hh_callback(code: str = None, state: str = None, error: str = None):
    frontend_editor = f"{settings.FRONTEND_URL}/editor/{state}"

    if error or not code or not state:
        return RedirectResponse(f"{frontend_editor}?import_error=true")

    try:
        # Обмениваем code на access_token
        token_resp = http_requests.post(
            _HH_TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "client_id": settings.HH_CLIENT_ID,
                "client_secret": settings.HH_CLIENT_SECRET,
                "code": code,
                "redirect_uri": _REDIRECT_URI,
            },
            headers=_HEADERS,
            timeout=10,
        )
        token_data = token_resp.json()
        access_token = token_data.get("access_token")
        if not access_token:
            return RedirectResponse(f"{frontend_editor}?import_error=true")

        auth_headers = {**_HEADERS, "Authorization": f"Bearer {access_token}"}

        # Получаем список резюме пользователя
        resumes_resp = http_requests.get(
            f"{_HH_API}/resumes/mine", headers=auth_headers, timeout=10
        )
        items = resumes_resp.json().get("items", [])
        if not items:
            return RedirectResponse(f"{frontend_editor}?import_error=true")

        # Берём самое первое (актуальное) резюме
        hh_resume_id = items[0]["id"]
        resume_resp = http_requests.get(
            f"{_HH_API}/resumes/{hh_resume_id}", headers=auth_headers, timeout=10
        )
        hh_data = resume_resp.json()
    except Exception:
        return RedirectResponse(f"{frontend_editor}?import_error=true")

    mapped = _map_hh_to_blocks(hh_data)

    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.id == state).first()
        if not resume:
            return RedirectResponse(f"{frontend_editor}?import_error=true")

        blocks = resume.blocks_data or []
        for block in blocks:
            bt = block.get("block_type")
            if bt in mapped:
                block["content"] = mapped[bt]

        resume.blocks_data = blocks
        flag_modified(resume, "blocks_data")
        db.commit()
    finally:
        db.close()

    return RedirectResponse(f"{frontend_editor}?imported=true")


def _map_hh_to_blocks(hh: dict) -> dict:
    result = {}

    # Контакты
    name = " ".join(filter(None, [
        hh.get("first_name", ""),
        hh.get("middle_name", ""),
        hh.get("last_name", ""),
    ]))

    email = phone = ""
    for contact in hh.get("contact", []):
        ctype = contact.get("type", {}).get("id", "")
        value = contact.get("value", "")
        if isinstance(value, dict):
            value = value.get("formatted", "")
        if ctype == "email" and not email:
            email = str(value)
        elif ctype in ("cell", "home") and not phone:
            phone = str(value)

    result["contacts"] = {
        "name": name,
        "email": email,
        "phone": phone,
        "location": hh.get("area", {}).get("name", ""),
        "website": "",
    }

    # О себе
    skills_text = hh.get("skills", "")
    if skills_text:
        result["summary"] = {"text": skills_text}

    # Опыт работы
    exp_items = []
    for exp in hh.get("experience", []):
        exp_items.append({
            "company": exp.get("company", ""),
            "position": exp.get("position", ""),
            "start_date": (exp.get("start") or "")[:7],
            "end_date": (exp.get("end") or "")[:7],
            "description": exp.get("description", ""),
        })
    if exp_items:
        result["experience"] = {"items": exp_items}

    # Образование
    edu_items = []
    for edu in hh.get("education", {}).get("primary", []):
        edu_items.append({
            "institution": edu.get("name", ""),
            "degree": edu.get("organization", "") or edu.get("result", ""),
            "year": str(edu.get("year", "")),
        })
    if edu_items:
        result["education"] = {"items": edu_items}

    # Навыки
    skill_set = hh.get("skill_set", [])
    if skill_set:
        result["skills"] = {"items": skill_set}

    # Языки
    lang_items = []
    for lang in hh.get("language", []):
        level = lang.get("level", {}).get("name", "")
        lang_name = lang.get("name", "")
        lang_items.append(f"{lang_name} — {level}" if level else lang_name)
    if lang_items:
        result["languages"] = {"items": lang_items}

    return result
