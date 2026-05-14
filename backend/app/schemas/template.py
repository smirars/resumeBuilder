from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.schemas.block import TemplateBlockResponse


class TemplateListItem(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    available_colors: List[str] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class TemplateDetail(TemplateListItem):
    blocks: List[TemplateBlockResponse] = []
