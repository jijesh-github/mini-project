import json
import logging
import re
from app.core.llm import generate_content_async
from app.models.template_schemas import ContentResponse

logger = logging.getLogger(__name__)

CONTENT_SYSTEM_PROMPT = """\
You are an AI content assistant that generates short, visually suitable event content for posters and invitations.

Given a user prompt, return ONLY a valid JSON object with exactly these three keys:
- "title": A short, catchy event title (max 6 words)
- "description": A one-sentence event description (max 20 words)
- "date": A short date string like "Dec 12, 2026" or "Jan 5, 2027 @ 7 PM"

Rules:
- Output ONLY raw JSON — no markdown, no code blocks, no explanations.
- Be concise and visually suitable for a poster.
- If the user prompt lacks date info, use a reasonable placeholder like "Date TBD".

Example output:
{"title": "Neon Nights 2026", "description": "An electrifying evening of music, light, and celebration.", "date": "Dec 12, 2026 @ 8 PM"}
"""


async def generate_event_content(prompt: str) -> ContentResponse:
    """
    Calls Groq to generate structured event content (title, description, date).
    Validates the JSON response strictly.
    """
    full_prompt = f"{CONTENT_SYSTEM_PROMPT}\n\nUSER PROMPT:\n{prompt}"

    try:
        response_text = await generate_content_async(full_prompt)
        logger.info(f"Raw Groq response: {response_text!r}")

        # Strip markdown code blocks if model wraps them
        cleaned = response_text.strip()
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)

        data = json.loads(cleaned)

        # Validate required keys
        required_keys = {"title", "description", "date"}
        missing = required_keys - set(data.keys())
        if missing:
            raise ValueError(f"Groq response missing keys: {missing}")

        return ContentResponse(
            title=str(data["title"]),
            description=str(data["description"]),
            date=str(data["date"]),
        )

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e} | Raw: {response_text!r}")
        raise ValueError("AI returned invalid JSON. Please try again.")
    except Exception as e:
        logger.error(f"AI content generation error: {e}")
        raise
