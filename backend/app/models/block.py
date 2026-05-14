from sqlalchemy import Column, Integer, String, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class BlockType(Base):
    __tablename__ = "block_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)
    display_name = Column(String(100), nullable=False)
    default_config = Column(JSON)


class TemplateBlock(Base):
    __tablename__ = "template_blocks"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("templates.id", ondelete="CASCADE"))
    block_type_id = Column(Integer, ForeignKey("block_types.id"))
    position = Column(Integer, nullable=False)
    is_removable = Column(Boolean, default=True)
    default_content = Column(JSON)

    template = relationship("Template", back_populates="blocks")
    block_type = relationship("BlockType")
