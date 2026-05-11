from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class TemplateOut(BaseModel):
    """Response schema for a single template."""
    id: int
    name: str
    category: str
    preview_url: Optional[str] = None
    fabric_json: Optional[Any] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ContentRequest(BaseModel):
    """Request body for AI content generation."""
    prompt: str


class ContentResponse(BaseModel):
    """Structured AI-generated poster/invitation content."""
    title: str
    description: str
    date: str
