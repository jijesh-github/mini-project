from groq import Groq
from app.core.config import settings

_client = Groq(api_key=settings.GROQ_API_KEY)


async def generate_content_async(prompt: str) -> str:
    """
    Sends a prompt to Groq and returns the raw text response.
    Kept as async for API compatibility — Groq SDK is sync,
    so we run it directly (fast enough for these workloads).
    """
    chat_completion = _client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=settings.GROQ_MODEL,
    )
    return chat_completion.choices[0].message.content
