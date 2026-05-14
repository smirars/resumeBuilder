from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class ResumeCreate(BaseModel):
    template_id: int
    color: Optional[str] = None
    font: Optional[str] = "Arial"


class ResumeUpdate(BaseModel):
    color: Optional[str] = None
    font: Optional[str] = None
    blocks_data: Optional[List[Any]] = None


class ResumeResponse(BaseModel):
    id: str
    template_id: int
    color: str
    font: str
    blocks_data: List[Any]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
