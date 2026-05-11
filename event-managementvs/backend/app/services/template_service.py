import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.template import Template
from app.models.template_schemas import TemplateOut

logger = logging.getLogger(__name__)


def get_templates(db: Session, category: Optional[str] = None) -> List[TemplateOut]:
    """
    Fetches all templates, optionally filtered by category.
    Category matching is case-insensitive.
    """
    try:
        query = db.query(Template)
        if category:
            query = query.filter(Template.category.ilike(category))
        templates = query.all()
        logger.info(f"Fetched {len(templates)} template(s) [category={category!r}]")
        return [TemplateOut.model_validate(t) for t in templates]
    except Exception as e:
        logger.error(f"Error fetching templates: {e}")
        raise


def get_template_by_id(db: Session, template_id: int) -> Optional[TemplateOut]:
    """
    Fetches a single template by its primary key.
    Returns None if not found.
    """
    try:
        template = db.query(Template).filter(Template.id == template_id).first()
        if template:
            logger.info(f"Fetched template id={template_id}")
            return TemplateOut.model_validate(template)
        logger.warning(f"Template id={template_id} not found")
        return None
    except Exception as e:
        logger.error(f"Error fetching template {template_id}: {e}")
        raise
