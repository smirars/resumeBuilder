from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.block import TemplateBlock
from app.models.template import Template
from app.schemas.template import TemplateDetail, TemplateListItem
from app.services.cache import cache_get, cache_set

router = APIRouter(prefix="/api/templates", tags=["templates"])

_TTL = 3600


@router.get("/", response_model=list[TemplateListItem])
def get_templates(db: Session = Depends(get_db)):
    cached = cache_get("templates:all")
    if cached is not None:
        return cached

    result = db.query(Template).all()
    cache_set("templates:all", jsonable_encoder(result), ttl=_TTL)
    return result


@router.get("/{template_id}", response_model=TemplateDetail)
def get_template(template_id: int, db: Session = Depends(get_db)):
    key = f"templates:{template_id}"
    cached = cache_get(key)
    if cached is not None:
        return cached

    template = (
        db.query(Template)
        .options(joinedload(Template.blocks).joinedload(TemplateBlock.block_type))
        .filter(Template.id == template_id)
        .first()
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    cache_set(key, jsonable_encoder(template), ttl=_TTL)
    return template
