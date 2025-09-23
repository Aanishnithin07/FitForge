// CSV export utility using Blob and URL.createObjectURL

function csvEscape(value) {
  const s = String(value ?? '')
  if (/[",\n]/.test(s)) {
    return '"' + s.replaceAll('"','""') + '"'
  }
  return s
}

export function downloadCSV({ jdTitle = '', candidateName = '', score, matchedSkills = [], suggestions = [] }) {
  const headers = ['Timestamp','JD Title','Candidate','Score','Matched Skills','Suggestions']
  const row = [
    new Date().toISOString(),
    jdTitle,
    candidateName,
    String(score),
    matchedSkills.join('; '),
    suggestions.join('; ')
  ]
  const csv = [headers, row].map(r => r.map(csvEscape).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'fitforge-summary.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// Minimal PDF export using a printable window approach (keeps deps at zero).
// For more control, you can later swap to jsPDF, but we keep it dependency-free.
export function downloadPDF({ jdTitle = '', candidateName = '', score, label, matchedSkills = [], missingSkills = [], suggestions = [] }) {
  const html = `<!doctype html>
  <html><head><meta charset="utf-8"><title>FitForge Report</title>
  <style>
    body{font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding:24px;}
    h1{margin:0 0 8px 0;}
    .muted{color:#555}
    .section{margin-top:16px}
    ul{margin:6px 0;}
    .badge{display:inline-block;padding:6px 10px;border-radius:8px;background:#eee;font-weight:700}
  </style>
  </head><body>
  <h1>FitForge Report</h1>
  <div class="muted">Generated: ${new Date().toLocaleString()}</div>
  <div class="section"><strong>Candidate:</strong> ${candidateName || '-'}<br/>
  <strong>Job Title:</strong> ${jdTitle || '-'}</div>
  <div class="section"><span class="badge">Score: ${score} (${label})</span></div>
  <div class="section"><strong>Matched skills</strong><ul>${matchedSkills.map(s=>`<li>${s}</li>`).join('') || '<li>-</li>'}</ul></div>
  <div class="section"><strong>Missing skills</strong><ul>${missingSkills.map(s=>`<li>${s}</li>`).join('') || '<li>-</li>'}</ul></div>
  <div class="section"><strong>Suggestions</strong><ul>${suggestions.map(s=>`<li>${s}</li>`).join('') || '<li>-</li>'}</ul></div>
  <script>window.onload=()=>{window.print(); setTimeout(()=>window.close(), 300);}</script>
  </body></html>`
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'fitforge-report.html' // printable HTML; users can save as PDF
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function downloadLeaderboardCSV(rows = []) {
  const headers = ['Candidate','Score','Top 3 Missing Skills']
  const csv = [headers, ...rows.map(r => [r.candidateName || '-', String(r.score), (r.topMissing || []).join('; ')])]
    .map(r => r.map(csvEscape).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'fitforge-leaderboard.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default { downloadCSV, downloadPDF, downloadLeaderboardCSV }




