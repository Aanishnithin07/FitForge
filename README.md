# FitForge – HR Role-Fit Analyzer (Client‑Only)

FitForge is a lightweight, client-only React app that helps HR and hiring managers quickly assess role-fit between a Job Description and a Resume. Paste text or upload .txt files, get an instant 0–100 fit score, see matched skills/keywords, and download a CSV summary. No servers, no data leaves the browser. Easy to run locally and deploy to Vercel.

## One‑click Deploy (Vercel)
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: repository root (where `package.json` lives)
- Include the provided `vercel.json` for automatic detection.

## Getting Started

### Prerequisites
- Node 18+ and npm

### Install & Run
```bash
npm install
npm run dev
```
Visit `http://localhost:5173`.

### Build
```bash
npm run build
```
Outputs to `dist/`.

## Features
- Two input methods: paste into textareas or upload `.txt` files (drag & drop supported).
- Client-side analyzer with:
  - Normalization: lowercase, punctuation removal, whitespace collapse
  - Stopword removal (built-in list; see `src/utils/analyzer.js`)
  - Lightweight stemming (removes `ing`, `ed`, `es`, `s` suffices)
  - JD keyword extraction (top tokens by frequency)
  - Curated skill matching via `src/data/skills.json`
  - Scoring: skills (0.6), keywords (0.3), length heuristic (0.1) → 0–100
- Results:
  - Big numeric score with interpretation (Excellent / Good / Needs review)
  - Inline highlights using `<mark>` in both JD and resume
  - Top 5 suggestions (JD tokens missing from resume)
  - CSV export: timestamp, JD title, candidate name, score, matched skills, suggestions
- Accessibility:
  - Labeled inputs, keyboard-friendly controls
  - `aria-live` for dynamic score updates
- Mobile responsive styling

## Tuning & Extensibility
- Adjust weights and heuristics in `src/utils/analyzer.js`:
  - `skillWeight` (default 0.6)
  - `keywordWeight` (default 0.3)
  - `lengthWeight` (default 0.1)
  - Length thresholds (e.g., 120 and 1200 tokens)
- Extend curated skills in `src/data/skills.json` (simple array of strings).
- Replace the simple stemmer with a stronger algorithm if desired—kept lightweight for transparency.

## File Structure
```
hr-fitforge/
├─ package.json
├─ index.html
├─ vercel.json
├─ README.md
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ styles.css
   ├─ data/
   │  └─ skills.json
   ├─ components/
   │  ├─ TextInputBlock.jsx
   │  ├─ ResultsPanel.jsx
   │  └─ Header.jsx
   └─ utils/
      ├─ analyzer.js
      └─ export.js
```

## Examples
- `examples/sample-jd.txt`
- `examples/sample-resume.txt`

You can paste from these files to see the analyzer in action.

## Notes
- Client-only: no API keys, no server calls.
- `.txt` uploads are supported; `.docx` can be added later (e.g., with `mammoth`) — left as a TODO in the code.
- CSV export uses `Blob` and `URL.createObjectURL` (no external deps).

## Optional Ideas (commented)
- You may add optional, commented-out code in `analyzer.js` to integrate an LLM. Keep it disabled by default, and never include API keys in the repo.

## License
MIT


