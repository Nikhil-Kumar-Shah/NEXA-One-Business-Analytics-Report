"""Configuration module for NEXA One data layer.

Discovers project workbooks dynamically using relative paths, verifies
file existence, and establishes cache paths without hardcoding absolute
machine-specific directories.
"""

from pathlib import Path
from typing import List, Optional


class ConfigError(Exception):
    """Raised when configuration or source file discovery fails."""
    pass


class Settings:
    """Project-wide settings and source workbook path resolution."""

    def __init__(self, base_dir: Optional[Path] = None):
        if base_dir is not None:
            self.base_dir = Path(base_dir).resolve()
            self._explicit_base_dir = True
        else:
            # Resolves the parent directory containing backend/
            current_file = Path(__file__).resolve()
            # backend/app/config.py -> parent of backend is project root
            self.base_dir = current_file.parents[2]
            self._explicit_base_dir = False

        # Resolve writable cache directory safely:
        # In serverless environments (e.g. AWS Lambda / Vercel), /var/task is read-only.
        import tempfile
        try:
            candidate_cache = self.base_dir / ".cache"
            candidate_cache.mkdir(parents=True, exist_ok=True)
            self.cache_dir = candidate_cache
        except (OSError, PermissionError):
            self.cache_dir = Path(tempfile.gettempdir()) / "nexa_cache"
            try:
                self.cache_dir.mkdir(parents=True, exist_ok=True)
            except Exception:
                pass

    @property
    def advertising_workbook_candidates(self) -> List[str]:
        return [
            "GTA_2_0_NEXA_Advertising_Analysis_Workbook.xlsx",
            "GTA_2_0_NEXA_Advertising_Analysis.xlsx",
        ]

    @property
    def q3_customer_workbook_name(self) -> str:
        return "GTA_2_0_NEXA_Q3_Customer_Research_Dataset.xlsx"

    @property
    def q4_market_workbook_name(self) -> str:
        return "GTA_2_0_NEXA_Q4_Market_Macro_Research_Dataset.xlsx"

    def _find_file(self, filename_candidates: List[str], desc: str) -> Path:
        """Searches for a file across multiple probable directory roots."""
        import os
        search_dirs = []
        if "NEXA_DATA_DIR" in os.environ:
            search_dirs.append(Path(os.environ["NEXA_DATA_DIR"]).resolve())
        search_dirs.extend([
            self.base_dir,
            Path.cwd(),
            Path(__file__).resolve().parents[2],
            Path(__file__).resolve().parents[1],
            Path(__file__).resolve().parent,
        ])

        unique_dirs = []
        for d in search_dirs:
            if d not in unique_dirs and d.exists():
                unique_dirs.append(d)

        for d in unique_dirs:
            for fname in filename_candidates:
                candidate_path = d / fname
                if candidate_path.is_file():
                    return candidate_path

        raise FileNotFoundError(
            f"Required {desc} not found in '{self.base_dir}'. Looked for: {filename_candidates}"
        )

    def get_advertising_workbook_path(self) -> Path:
        if self._explicit_base_dir:
            for candidate in self.advertising_workbook_candidates:
                path = self.base_dir / candidate
                if path.is_file():
                    return path
            raise FileNotFoundError(
                f"Required Advertising workbook not found in '{self.base_dir}'. "
                f"Looked for: {self.advertising_workbook_candidates}"
            )
        return self._find_file(self.advertising_workbook_candidates, "Advertising workbook")

    def get_q3_customer_workbook_path(self) -> Path:
        if self._explicit_base_dir:
            path = self.base_dir / self.q3_customer_workbook_name
            if path.is_file():
                return path
            raise FileNotFoundError(
                f"Required Q3 Customer Research workbook not found: '{path}'"
            )
        return self._find_file([self.q3_customer_workbook_name], "Q3 Customer Research workbook")

    def get_q4_market_workbook_path(self) -> Path:
        if self._explicit_base_dir:
            path = self.base_dir / self.q4_market_workbook_name
            if path.is_file():
                return path
            raise FileNotFoundError(
                f"Required Q4 Market Macro Research workbook not found: '{path}'"
            )
        return self._find_file([self.q4_market_workbook_name], "Q4 Market Macro Research workbook")

    def verify_all_workbooks(self) -> dict:
        """Verifies that all three source workbooks exist and returns their paths."""
        return {
            "advertising": self.get_advertising_workbook_path(),
            "q3_customer": self.get_q3_customer_workbook_path(),
            "q4_market": self.get_q4_market_workbook_path(),
        }


settings = Settings()
