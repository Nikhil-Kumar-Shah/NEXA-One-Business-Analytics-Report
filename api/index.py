"""Vercel Serverless Function entrypoint for NEXA One Analytical API.
Exposes the authoritative FastAPI app instance for Vercel Python runtime,
wrapping it with transparent path resolution for Vercel edge rewrites.
"""

from pathlib import Path
import sys
import urllib.parse

# Ensure repository root is on sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Import the existing production FastAPI instance
from backend.app.main import app as base_app  # noqa: E402


class VercelAsgiRouter:
    """ASGI middleware ensuring Vercel rewrites correctly resolve internal FastAPI endpoints."""

    def __init__(self, inner_app):
        self.inner_app = inner_app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            # Check if Vercel edge router forwarded request to /api/index.py or /api/index
            if path in ("/api/index.py", "/api/index", "/api/index.py/", "/api", "/api/"):
                qs = scope.get("query_string", b"").decode("utf-8")
                params = urllib.parse.parse_qs(qs)

                # 1. Resolve subpath from rewrite query parameters (:match* or :subpath*)
                subpath = None
                for key in ("match", "subpath", "path", "route"):
                    if key in params and params[key]:
                        subpath = params[key][0].lstrip("/")
                        params.pop(key, None)
                        break

                if subpath:
                    scope["path"] = f"/api/{subpath}"
                    scope["raw_path"] = scope["path"].encode("utf-8")
                    new_qs = urllib.parse.urlencode(params, doseq=True)
                    scope["query_string"] = new_qs.encode("utf-8")
                else:
                    # 2. Check x-matched-path header from Vercel edge network
                    headers = dict(scope.get("headers", []))
                    matched = headers.get(b"x-matched-path", b"").decode("utf-8")
                    if matched and matched not in ("/api/index.py", "/api/index", "/api/index.py/", "/api", "/api/"):
                        scope["path"] = matched if matched.startswith("/api") else f"/api{matched}"
                        scope["raw_path"] = scope["path"].encode("utf-8")
                    elif path in ("/api/index.py", "/api/index", "/api/index.py/"):
                        # Default direct ping to health check
                        scope["path"] = "/api/health"
                        scope["raw_path"] = b"/api/health"

        await self.inner_app(scope, receive, send)


# Export app wrapped with Vercel ASGI routing
app = VercelAsgiRouter(base_app)

__all__ = ["app"]
