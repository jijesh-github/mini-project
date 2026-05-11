import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.template_schemas import TemplateOut
from app.services.template_service import get_templates, get_template_by_id

from sqlalchemy import text
from app.core.database import get_db

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Templates"])


@router.get("/templates", response_model=List[TemplateOut])
def list_templates(
    category: Optional[str] = Query(None, description="Filter by category, e.g. 'poster' or 'invitation'"),
    db: Session = Depends(get_db),
):
    """
    Returns all templates, optionally filtered by category.

    GET /templates
    GET /templates?category=poster
    GET /templates?category=invitation
    """
    try:
        return get_templates(db, category=category)
    except Exception as e:
        logger.error(f"list_templates error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch templates.")


@router.get("/templates/{template_id}", response_model=TemplateOut)
def get_template(template_id: int, db: Session = Depends(get_db)):
    """
    Returns a single template by ID.

    GET /templates/1
    """
    try:
        template = get_template_by_id(db, template_id)
        if not template:
            raise HTTPException(status_code=404, detail=f"Template {template_id} not found.")
        return template
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"get_template error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch template.")
