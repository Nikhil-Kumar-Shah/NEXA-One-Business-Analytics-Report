"""Vercel Serverless Function entrypoint for NEXA One Analytical API.
Exposes the authoritative FastAPI app instance for Vercel Python runtime.
"""

from pathlib import Path
import sys

# Ensure repository root is on sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Import the existing production FastAPI instance
from backend.app.main import app  # noqa: E402

# Export app for Vercel
__all__ = ["app"]
