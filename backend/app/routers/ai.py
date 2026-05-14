from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.resume import Resume
from app.services.ai_service import analyze_resume

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/analyze/{resume_id}")
def ai_analyze(resume_id: str, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    try:
        return analyze_resume(resume)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка анализа: {str(e)}")
