from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.resume import Resume
from app.services.pdf_service import generate_pdf
from app.services.docx_service import generate_docx

router = APIRouter(prefix="/api/export", tags=["export"])


@router.post("/pdf/{resume_id}")
def export_pdf(resume_id: str, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    file_path = generate_pdf(resume)
    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename="resume.pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"},
    )


@router.post("/docx/{resume_id}")
def export_docx(resume_id: str, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    file_path = generate_docx(resume)
    return FileResponse(
        path=file_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="resume.docx",
        headers={"Content-Disposition": "attachment; filename=resume.docx"},
    )
