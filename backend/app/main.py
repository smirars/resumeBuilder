from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import templates, resumes, export, ai, hh, upload

app = FastAPI(title="Resume Builder API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(templates.router)
app.include_router(resumes.router)
app.include_router(export.router)
app.include_router(ai.router)
app.include_router(hh.router)
app.include_router(upload.router)


@app.get("/health")
def health():
    return {"status": "ok"}
