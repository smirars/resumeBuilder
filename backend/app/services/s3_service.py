import logging
import uuid
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)

_client = None


def _get_client():
    global _client
    if _client is not None:
        return _client
    if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_BUCKET_NAME:
        return None
    try:
        import boto3
        kwargs = {
            "aws_access_key_id": settings.AWS_ACCESS_KEY_ID,
            "aws_secret_access_key": settings.AWS_SECRET_ACCESS_KEY,
            "region_name": settings.AWS_REGION,
        }
        if settings.AWS_ENDPOINT_URL:
            kwargs["endpoint_url"] = settings.AWS_ENDPOINT_URL
        _client = boto3.client("s3", **kwargs)
    except Exception as e:
        logger.warning("S3 client init failed: %s", e)
    return _client


def is_configured() -> bool:
    return bool(settings.AWS_ACCESS_KEY_ID and settings.AWS_BUCKET_NAME)


def upload_photo(data: bytes, content_type: str) -> str:
    client = _get_client()
    if not client:
        raise RuntimeError("S3 not configured")

    ext = content_type.split("/")[-1] if "/" in content_type else "jpg"
    key = f"photos/{uuid.uuid4()}.{ext}"

    client.put_object(
        Bucket=settings.AWS_BUCKET_NAME,
        Key=key,
        Body=data,
        ContentType=content_type,
        ACL="public-read",
    )

    if settings.AWS_ENDPOINT_URL:
        return f"{settings.AWS_ENDPOINT_URL.rstrip('/')}/{settings.AWS_BUCKET_NAME}/{key}"
    return f"https://{settings.AWS_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"


def delete_photo(url: str) -> None:
    client = _get_client()
    if not client:
        return
    try:
        if settings.AWS_ENDPOINT_URL:
            prefix = f"{settings.AWS_ENDPOINT_URL.rstrip('/')}/{settings.AWS_BUCKET_NAME}/"
        else:
            prefix = f"https://{settings.AWS_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/"
        if url.startswith(prefix):
            key = url[len(prefix):]
            client.delete_object(Bucket=settings.AWS_BUCKET_NAME, Key=key)
    except Exception as e:
        logger.warning("S3 delete error: %s", e)
