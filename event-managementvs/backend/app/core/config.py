import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GROQ_API_KEY: str
    GROQ_MODEL: str = "llama-3.1-8b-instant"
    DATABASE_URL: str = "postgresql://postgres:jijeshraj$21@localhost:5432/trialdb"
    
    SECRET_KEY: str = "yoursecretkey12345!@#$xxyyzz"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), "../../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
