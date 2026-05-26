import base64

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services import s3_service

router = APIRouter(prefix="/api/upload", tags=["upload"])

_MAX_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/photo")
async def upload_photo(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    data = await file.read()
    if len(data) > _MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 5 MB)")

    if s3_service.is_configured():
        try:
            url = s3_service.upload_photo(data, file.content_type)
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"S3 upload failed: {e}")
    else:
        b64 = base64.b64encode(data).decode()
        url = f"data:{file.content_type};base64,{b64}"

    return {"url": url}
