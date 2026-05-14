from pydantic import BaseModel
from typing import Optional, Any


class BlockTypeResponse(BaseModel):
    id: int
    name: str
    display_name: str
    default_config: Optional[Any] = None

    model_config = {"from_attributes": True}


class TemplateBlockResponse(BaseModel):
    id: int
    position: int
    is_removable: bool
    default_content: Optional[Any] = None
    block_type: BlockTypeResponse

    model_config = {"from_attributes": True}
