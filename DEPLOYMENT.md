# NEXA One Business Analytics Report — Deployment Guide

This guide details the production deployment architecture, environment configuration, local development instructions, and troubleshooting steps for the **NEXA One Business Analytics Report**.

---

## 1. System Architecture

The application is architected as an integrated single-project deployment on **Vercel**:

```text
Browser Client
     │
     ▼
Vercel Edge Network
     │
     ├───► Static / SPA Routes (/report/*, /) ──► React 18 Application (Vite bundle)
     │
     └───► API Routes (/api/*) ────────────────► FastAPI Serverless Function (api/index.py)
                                                        │
                                                        ▼
                                               Analytical Service Layer
                                                        │
                                                        ▼
                                               Approved Project Datasets
                                               (Internal Advertising, Q3 Research, Q4 Macro)
```

- **Frontend**: React 18 SPA built with Vite and Vanilla CSS. Serves report navigation and interactive evidence exploration.
- **Backend**: Python 3.12+ / FastAPI serverless function (`api/index.py`). Performs read-only econometric models, multivariate regression, Pearson correlation, and evidence filtering.
- **Same-Origin API**: In production, both frontend and backend resolve under the same domain. All API requests use relative paths (`/api/...`), eliminating cross-origin latency and CORS complications.
- **Online Published Workbooks**: Contextual Google Sheets links provide reader transparency and audit traceability to published workbook representations without creating a runtime network dependency.

---

## 2. Requirements

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Python**: 3.10, 3.11, or 3.12 (Vercel Python runtime defaults to 3.12)
- **Python Package Manager**: `pip`

---

## 3. Local Development

### Option A: Running with npm & uvicorn (Standard Dev)

1. **Install Dependencies**:
   ```bash
   # Root / Frontend dependencies
   npm --prefix frontend install

   # Backend Python dependencies
   pip install -r requirements.txt
   ```

2. **Start Backend Server**:
   ```bash
   # From repository root
   python3 -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

3. **Start Frontend Dev Server**:
   ```bash
   # In a separate terminal
   npm --prefix frontend run dev
   ```
   Open `http://localhost:5173`. Vite automatically proxies `/api` requests to `http://127.0.0.1:8000`.

### Option B: Running with Vercel CLI (Vercel-Compatible Dev)

Test the complete monorepo under Vercel's unified serverless runtime:
```bash
# Install Vercel CLI globally if not already installed
npm install -g vercel

# Run from project root
vercel dev
```

---

## 4. Production Build & Deployment

### Production Build Test (Local)
Verify that the frontend compiles cleanly:
```bash
npm --prefix frontend run build
```

### Vercel Deployment

1. **Connect to Vercel**:
   Deploy directly from the project root using Vercel CLI:
   ```bash
   vercel
   ```

2. **Deploy to Production**:
   ```bash
   vercel deploy --prod
   ```

3. **Git Integration (Recommended)**:
   Link your GitHub/GitLab repository directly in the Vercel Dashboard. Vercel automatically detects:
   - Build Command: `npm --prefix frontend install && npm --prefix frontend run build`
   - Output Directory: `frontend/dist`
   - Serverless Functions: `api/index.py` (FastAPI)

---

## 5. Environment Variables

Refer to `.env.example` for reference. All environment variables are optional with zero-config defaults:

| Variable Name | Purpose | Required | Default |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Custom backend API origin | No (Optional) | `""` (Relative `/api` requests) |
| `NEXA_DATA_DIR` | Custom path to Excel workbooks | No (Optional) | Project root |
| `PORT` | Local server port for standalone execution | No (Optional) | `8000` |

> **Important**: Never commit credentials, tokens, or private secrets to source control.

---

## 6. Troubleshooting

### 1. SPA Route Refresh 404 (e.g. on `/report/advertising-sales`)
- **Cause**: Web server attempting to locate a file on disk matching the URL rather than delegating routing to `index.html`.
- **Solution**: Handled automatically by `vercel.json` rewrites:
  ```json
  { "source": "/(.*)", "destination": "/index.html" }
  ```
  Ensure `vercel.json` is located in the repository root.

### 2. API 404 or Intercepted by Frontend HTML
- **Cause**: Rewrite rules catching `/api/*` and returning `index.html`.
- **Solution**: The `/api/(.*)` rewrite to `/api/index.py` is declared **before** the SPA catch-all rule in `vercel.json`.

### 3. Missing Workbook Data File Error
- **Cause**: Python runtime unable to find the `.xlsx` files due to unexpected working directory.
- **Solution**: `backend/app/config.py` uses dynamic multi-path resolution searching `NEXA_DATA_DIR`, `base_dir`, `Path.cwd()`, and module parent hierarchy. Ensure `.xlsx` files are included in git deployment.

### 4. Python Serverless Function Exceeds Maximum Size
- **Cause**: Unnecessary heavy ML or GUI libraries in `requirements.txt`.
- **Solution**: `requirements.txt` is intentionally lean (only `fastapi`, `uvicorn`, `pydantic`, `pandas`, `openpyxl`, `numpy`, `httpx`).

### 5. Frontend Build Failure
- **Verify**: Run `npm --prefix frontend run build`. Check for missing JSX imports, unresolved CSS classes, or syntax errors.
