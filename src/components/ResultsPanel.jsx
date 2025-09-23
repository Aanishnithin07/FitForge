import React from 'react'

export default function ResultsPanel({ result, annotatedJD, annotatedResume, onExport, onExportPDF }) {
  if (!result) return (
    <div className="panel" aria-live="polite">Enter a JD and a Resume to see results.</div>
  )

  const { score, label, matchedSkills, matchedKeywords, suggestedTop5, missingSkills, extraResumeSkills, breakdown } = result
  const scoreClass = score > 70 ? 'good' : score >= 40 ? 'mid' : 'low'
  const interpretation = label

  return (
    <div className="panel" aria-live="polite">
      <div className={`score ${scoreClass}`} aria-label={`Fit score ${score} out of 100`}>
        {score}%
      </div>
      <div className="muted" style={{marginBottom: 12}}>{interpretation}</div>

      {/* Mini breakdown chart as horizontal bars */}
      <div style={{display:'grid', gap:8, marginBottom: 12}}>
        <Bar label={`Skills matched (${breakdown.skillMatches}/${breakdown.skillsInJD})`} value={breakdown.skillsInJD ? (breakdown.skillMatches / breakdown.skillsInJD) : 0} color="#22c55e" />
        <Bar label={`Skills missing (${breakdown.skillsMissing})`} value={breakdown.skillsInJD ? (breakdown.skillsMissing / breakdown.skillsInJD) : 0} color="#ef4444" />
        <Bar label={`Extra resume skills (${breakdown.skillsExtra})`} value={Math.min(1, breakdown.skillsExtra / 10)} color="#eab308" />
      </div>

      <div className="chips" style={{marginBottom: 12}}>
        {matchedSkills.map((s)=> <span key={s} className="chip" title="Matched curated skill">{s}</span>)}
        {matchedKeywords.filter(k=>!matchedSkills.includes(k)).map((k)=> <span key={k} className="chip">{k}</span>)}
      </div>

      <div className="results-grid">
        <div>
          <div className="muted" style={{marginBottom: 6}}>Job Description (highlighted)</div>
          <div className="annotated" dangerouslySetInnerHTML={{__html: annotatedJD}} />
        </div>
        <div>
          <div className="muted" style={{marginBottom: 6}}>Resume (highlighted)</div>
          <div className="annotated" dangerouslySetInnerHTML={{__html: annotatedResume}} />
        </div>
      </div>

      <div style={{marginTop: 16}}>
        <div style={{fontWeight: 700, marginBottom: 6}}>Top 5 Suggestions</div>
        <ul>
          {suggestedTop5.map((s)=> <li key={s}>{s}</li>)}
        </ul>
      </div>

      <div className="row" style={{marginTop: 12}}>
        <button onClick={onExport} aria-label="Export summary as CSV">Export CSV</button>
        <button className="secondary" onClick={onExportPDF} aria-label="Export summary as PDF">Export PDF</button>
      </div>
    </div>
  )
}

function Bar({ label, value, color }) {
  const pct = Math.round((value || 0) * 100)
  return (
    <div>
      <div className="muted" style={{fontSize:12, marginBottom:4}}>{label}</div>
      <div style={{background:'#0b1220', border:'1px solid rgba(148,163,184,0.25)', borderRadius:8, height:10}}>
        <div style={{width: pct+'%', height:'100%', background: color, borderRadius:8}} aria-label={`${label} ${pct}%`} />
      </div>
    </div>
  )
}




