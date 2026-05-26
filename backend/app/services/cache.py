import json
import logging
from typing import Any, Optional

import redis as redis_lib

from app.config import settings

logger = logging.getLogger(__name__)

_client: Optional[redis_lib.Redis] = None
_unavailable = False


def _get_client() -> Optional[redis_lib.Redis]:
    global _client, _unavailable
    if _unavailable or not settings.REDIS_URL:
        return None
    if _client is None:
        try:
            _client = redis_lib.from_url(settings.REDIS_URL, decode_responses=True)
            _client.ping()
        except Exception as e:
            logger.warning("Redis unavailable, caching disabled: %s", e)
            _client = None
            _unavailable = True
    return _client


def cache_get(key: str) -> Optional[Any]:
    client = _get_client()
    if not client:
        return None
    try:
        raw = client.get(key)
        return json.loads(raw) if raw is not None else None
    except Exception as e:
        logger.warning("Redis get error: %s", e)
        return None


def cache_set(key: str, value: Any, ttl: int = 300) -> None:
    client = _get_client()
    if not client:
        return
    try:
        client.setex(key, ttl, json.dumps(value, default=str))
    except Exception as e:
        logger.warning("Redis set error: %s", e)


def cache_delete(key: str) -> None:
    client = _get_client()
    if not client:
        return
    try:
        client.delete(key)
    except Exception as e:
        logger.warning("Redis delete error: %s", e)
