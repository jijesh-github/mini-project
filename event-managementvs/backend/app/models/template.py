from sqlalchemy import Column, Integer, Text, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.core.database import Base


class Template(Base):
    """
    ORM model for the existing `templates` table.
    Table is already created — do NOT call Base.metadata.create_all() for this.
    """
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    category = Column(Text, nullable=False)
    preview_url = Column(Text, nullable=True)
    fabric_json = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
