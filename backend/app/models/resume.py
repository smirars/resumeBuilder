import uuid
from datetime import datetime
from sqlalchemy import Column, String, JSON, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    template_id = Column(Integer, ForeignKey("templates.id"))
    color = Column(String(20), default="#2563eb")
    font = Column(String(100), default="Arial")
    blocks_data = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    template = relationship("Template")
