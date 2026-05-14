from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    thumbnail_url = Column(String(255))
    available_colors = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    blocks = relationship(
        "TemplateBlock",
        back_populates="template",
        order_by="TemplateBlock.position",
        cascade="all, delete-orphan",
    )
