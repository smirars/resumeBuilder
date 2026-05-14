import json
from groq import Groq
from app.config import settings
from app.models.resume import Resume

_SYSTEM = """Ты — профессиональный редактор резюме с опытом в HR и карьерном консультировании.
Анализируй текст резюме на русском языке и выявляй:
1. Грамматические и орфографические ошибки
2. Стилистические недочёты (канцелярит, повторы, слабые глаголы)
3. Формулировки, которые звучат непрофессионально
4. Конкретные рекомендации по улучшению

Отвечай ТОЛЬКО валидным JSON."""


def _extract_text(blocks_data: list) -> list:
    result = []
    for block in blocks_data:
        if not block.get("visible", True):
            continue
        bt = block.get("block_type")
        content = block.get("content", {})

        if bt == "photo":
            continue
        elif bt == "contacts":
            if content.get("name"):
                result.append({"блок": "Контакты", "поле": "Имя", "текст": content["name"]})
        elif bt == "summary":
            if content.get("text"):
                result.append({"блок": "О себе", "поле": "Текст", "текст": content["text"]})
        elif bt == "experience":
            for item in content.get("items", []):
                if item.get("position"):
                    result.append({"блок": "Опыт работы", "поле": "Должность", "текст": item["position"]})
                if item.get("description"):
                    result.append({"блок": "Опыт работы", "поле": "Описание", "текст": item["description"]})
        elif bt == "education":
            for item in content.get("items", []):
                if item.get("degree"):
                    result.append({"блок": "Образование", "поле": "Специальность", "текст": item["degree"]})
        elif bt == "skills":
            items = content.get("items", [])
            if items:
                result.append({"блок": "Навыки", "поле": "Список", "текст": ", ".join(items)})
        elif bt == "projects":
            for item in content.get("items", []):
                if item.get("name"):
                    result.append({"блок": "Проекты", "поле": "Название", "текст": item["name"]})
                if item.get("description"):
                    result.append({"блок": "Проекты", "поле": "Описание", "текст": item["description"]})
        elif bt == "languages":
            items = content.get("items", [])
            if items:
                result.append({"блок": "Языки", "поле": "Список", "текст": ", ".join(items)})

    return result


def analyze_resume(resume: Resume) -> dict:
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY не задан в .env")

    text_blocks = _extract_text(resume.blocks_data)
    if not text_blocks:
        return {"issues": [], "summary": "В резюме нет текста для анализа."}

    client = Groq(api_key=settings.GROQ_API_KEY)

    user_message = f"""Проанализируй текстовые блоки резюме и верни JSON:

{json.dumps(text_blocks, ensure_ascii=False, indent=2)}

Формат ответа:
{{
  "issues": [
    {{
      "type": "grammar | spelling | style | suggestion",
      "block": "название блока",
      "original": "оригинальная фраза",
      "improved": "улучшённый вариант",
      "explanation": "краткое объяснение на русском"
    }}
  ],
  "summary": "1–2 предложения: общая оценка резюме и главный совет"
}}

Типы: grammar — грамматика, spelling — орфография, style — стиль, suggestion — совет.
Если ошибок нет — верни пустой массив issues и положительную оценку."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=2048,
        temperature=0.3,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": _SYSTEM},
            {"role": "user", "content": user_message},
        ],
    )

    return json.loads(response.choices[0].message.content)
