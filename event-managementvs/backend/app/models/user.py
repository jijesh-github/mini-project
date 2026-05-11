from sqlalchemy import Column, Integer, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    email = Column(Text, unique=True, index=True, nullable=False)
    password = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
