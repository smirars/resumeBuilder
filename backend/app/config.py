from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/resumebuilder"
    GROQ_API_KEY: str = ""
    HH_CLIENT_ID: str = ""
    HH_CLIENT_SECRET: str = ""
    FRONTEND_URL: str = "http://localhost:5173"
    REDIS_URL: str = ""
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_BUCKET_NAME: str = ""
    AWS_REGION: str = "us-east-1"
    AWS_ENDPOINT_URL: str = ""

    model_config = {"env_file": ".env"}


settings = Settings()
