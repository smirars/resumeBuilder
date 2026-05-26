from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.block import TemplateBlock
from app.models.resume import Resume
from app.models.template import Template
from app.schemas.resume import ResumeCreate, ResumeResponse, ResumeUpdate
from app.services.cache import cache_delete, cache_get, cache_set

router = APIRouter(prefix="/api/resumes", tags=["resumes"])

_TTL = 300


def _resume_key(resume_id: str) -> str:
    return f"resumes:{resume_id}"


@router.post("/", response_model=ResumeResponse, status_code=201)
def create_resume(payload: ResumeCreate, db: Session = Depends(get_db)):
    template = (
        db.query(Template)
        .options(joinedload(Template.blocks).joinedload(TemplateBlock.block_type))
        .filter(Template.id == payload.template_id)
        .first()
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    blocks_data = [
        {
            "block_type": tb.block_type.name,
            "position": tb.position,
            "visible": True,
            "is_removable": tb.is_removable,
            "content": tb.default_content or {},
        }
        for tb in template.blocks
    ]

    default_color = template.available_colors[0] if template.available_colors else "#2563eb"
    resume = Resume(
        template_id=payload.template_id,
        color=payload.color or default_color,
        font=payload.font or "Arial",
        blocks_data=blocks_data,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(resume_id: str, db: Session = Depends(get_db)):
    key = _resume_key(resume_id)
    cached = cache_get(key)
    if cached is not None:
        return cached

    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    cache_set(key, jsonable_encoder(resume), ttl=_TTL)
    return resume


@router.put("/{resume_id}", response_model=ResumeResponse)
def update_resume(resume_id: str, payload: ResumeUpdate, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if payload.color is not None:
        resume.color = payload.color
    if payload.font is not None:
        resume.font = payload.font
    if payload.blocks_data is not None:
        resume.blocks_data = payload.blocks_data

    resume.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(resume)

    cache_delete(_resume_key(resume_id))
    return resume
