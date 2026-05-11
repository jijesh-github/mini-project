import logging
from fastapi import APIRouter, HTTPException
from app.models.template_schemas import ContentRequest, ContentResponse
from app.services.ai_service import generate_event_content

logger = logging.getLogger(__name__)
router = APIRouter(tags=["AI Content"])


@router.post("/generate-content", response_model=ContentResponse)
async def generate_content(request: ContentRequest):
    """
    Generates AI-powered event content (title, description, date) using Groq.

    POST /generate-content
    Body: { "prompt": "Birthday party for kids at Central Park" }

    Response: { "title": "...", "description": "...", "date": "..." }
    """
    if not request.prompt.strip():
        raise HTTPException(status_code=422, detail="Prompt cannot be empty.")

    try:
        content = await generate_event_content(request.prompt)
        logger.info(f"Content generated for prompt: {request.prompt!r}")
        return content
    except ValueError as e:
        # Validation / JSON parse errors from AI response
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        logger.error(f"generate_content error: {e}")
        raise HTTPException(status_code=500, detail="AI content generation failed. Please try again.")
