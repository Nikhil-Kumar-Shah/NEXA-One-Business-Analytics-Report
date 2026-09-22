# NEXA One — Business Analytics Report

**NEXA One — Business Analytics Report** is an interactive analytical report combining statistical advertising analysis, independent customer research, market and macroeconomic evidence, strategic synthesis and actionable recommendations.

---

## Analytical Architecture

The report is structured into 9 coherent, sequential sections answering 5 core business questions:

1. **01 Executive Overview** — Executive summary, multi-source synthesis, and core findings.
2. **02 Data & Methodology** — Dataset foundation, descriptive audits, and econometric modeling architecture.
3. **03 Advertising & Sales** — Multi-channel spend analysis, OLS regression model fit ($R^2 = 89.72\%$), and scatter plot inspection across 200 markets.
4. **04 Channel Analysis** — Statistical comparison of TV ($\beta = 0.0458$, $p < 0.0001$), Social Media ($\beta = 0.1885$, $p < 0.0001$), and Print ($\beta = -0.0010$, $p = 0.8596$).
5. **05 Customer Purchase Drivers** — Synthesis of 57 independent evidence observations across 10 authoritative research authorities.
6. **06 Market & Macro** — External market signals, category proxies, and macroeconomic context across 38 indicators and 9 institutions.
7. **07 Strategy Decision** — Transparent, evidence-linked strategic direction synthesizing attribution, consumer needs, and macroeconomic conditions.
8. **08 Recommendations & Action Plan** — Core managerial directives, phased 12-month implementation roadmap, and measurement frameworks.
9. **09 Methodology & Sources** — Authoritative register of all 20 source citations, audit trail, and analytical boundary limits.

---

## Published Online Workbooks (Google Sheets)

Direct public access to the published representations of the 3 underlying research workbooks:

- **Advertising Analysis Dataset**: [Google Sheets Workbook](https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6Beq43sYS4CsfiGT0R1xe7gJj9fkVvp3dURrOzfX_6B6zII9nGVnDplUdxEbzGg/pubhtml) (200 market-level observations)
- **Customer Research Dataset**: [Google Sheets Workbook](https://docs.google.com/spreadsheets/d/e/2PACX-1vSr2F0Q8mGgj71aMYSMhV-I7A7r7WxF_jL7YKZ0qtse-ZruIPajLSWiqSgT7GFAsw/pubhtml) (57 observations across 10 studies)
- **Market & Macro Research Dataset**: [Google Sheets Workbook](https://docs.google.com/spreadsheets/d/e/2PACX-1vTva6_i5TZp9R4nRlCEhtzY2TjViii2msFSi34o8lwdyf4GLiTV4BQF-TMf3knEJbIOKTfB03q_2f85/pubhtml) (38 indicators across 9 institutions)

---

## Core Data Integrity Baselines

- **Total Advertising Observations**: 200
- **Regression $R^2$**: $0.897210638178952$
- **Adjusted $R^2$**: $0.896167091358434$
- **TV-Sales Pearson Correlation**: $0.782224424861606$
- **Social Media-Sales Pearson Correlation**: $0.576222574571055$
- **Print-Sales Pearson Correlation**: $0.228299026376165$
- **Q3 Customer Evidence Records**: 57
- **Q4 Market & Macro Evidence Records**: 38

---

## Quick Start (Local Development)

```bash
# 1. Install frontend dependencies
npm --prefix frontend install

# 2. Install backend Python dependencies
pip install -r requirements.txt

# 3. Start backend API server
python3 -m uvicorn backend.app.main:app --port 8000

# 4. Start frontend Vite dev server (in a separate terminal)
npm --prefix frontend run dev
```

Visit `http://localhost:5173` to explore the report.

---

## Deployment

Refer to [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment instructions, Vercel zero-config architecture, and environment configuration.
