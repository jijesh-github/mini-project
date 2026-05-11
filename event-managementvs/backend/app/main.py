import sys
import os
import logging

# Ensure the backend root is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import router as legacy_router
from app.api.template_routes import router as template_router
from app.api.ai_routes import router as ai_routes
from app.api.ai_routes import router as ai_router
from app.api.auth_routes import router as auth_router

from app.core.database import Base, engine
import app.models.user
import app.models.template

# Create all tables in the database
Base.metadata.create_all(bind=engine)

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="EventAI Backend",
    description="Template-based AI event content generator. Powered by Groq + PostgreSQL.",
    version="2.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
# Auth router
app.include_router(auth_router)

# New template + AI routes (no prefix so URLs are /templates and /generate-content)
app.include_router(template_router)
app.include_router(ai_router)

# Legacy routes (reel, circular, poster, invitation — kept but under /api)
app.include_router(legacy_router, prefix="/api")

# Serve generated static files
generated_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "generated"))
if not os.path.exists(generated_dir):
    os.makedirs(generated_dir)
app.mount("/generated", StaticFiles(directory=generated_dir), name="generated")


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "version": "2.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
