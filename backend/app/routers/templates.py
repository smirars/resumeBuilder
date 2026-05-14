from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.template import Template
from app.models.block import TemplateBlock
from app.schemas.template import TemplateListItem, TemplateDetail

router = APIRouter(prefix="/api/templates", tags=["templates"])


@router.get("/", response_model=list[TemplateListItem])
def get_templates(db: Session = Depends(get_db)):
    return db.query(Template).all()


@router.get("/{template_id}", response_model=TemplateDetail)
def get_template(template_id: int, db: Session = Depends(get_db)):
    template = (
        db.query(Template)
        .options(joinedload(Template.blocks).joinedload(TemplateBlock.block_type))
        .filter(Template.id == template_id)
        .first()
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template
