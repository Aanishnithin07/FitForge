import React, { useMemo, useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import TextInputBlock from './components/TextInputBlock.jsx'
import ResultsPanel from './components/ResultsPanel.jsx'
import { analyze, annotateText } from './utils/analyzer.js'
import { downloadCSV, downloadPDF, downloadLeaderboardCSV } from './utils/export.js'
import { initCursorEffect, destroyCursorEffect } from './utils/cursorEffect.js'

export default function App() {
  // Initialize god-tier cursor effect
  useEffect(() => {
    const effect = initCursorEffect();
    return () => destroyCursorEffect();
  }, []);
  
  // State with localStorage persistence
  const [jdTitle, setJdTitle] = useState(() => localStorage.getItem('fitforge_jdTitle') || '')
  const [candidateName, setCandidateName] = useState(() => localStorage.getItem('fitforge_candidateName') || '')
  const [jdText, setJdText] = useState(() => localStorage.getItem('fitforge_jdText') || '')
  const [resumeText, setResumeText] = useState(() => localStorage.getItem('fitforge_resumeText') || '')
  const [batchResumes, setBatchResumes] = useState(() => {
    try {
      const saved = localStorage.getItem('fitforge_batchResumes')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  
  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('fitforge_jdTitle', jdTitle)
  }, [jdTitle])
  
  useEffect(() => {
    localStorage.setItem('fitforge_candidateName', candidateName)
  }, [candidateName])
  
  useEffect(() => {
    localStorage.setItem('fitforge_jdText', jdText)
  }, [jdText])
  
  useEffect(() => {
    localStorage.setItem('fitforge_resumeText', resumeText)
  }, [resumeText])
  
  useEffect(() => {
    localStorage.setItem('fitforge_batchResumes', JSON.stringify(batchResumes))
  }, [batchResumes])

  const result = useMemo(()=>{
    if (!jdText || !resumeText) return null
    return analyze({ jdText, resumeText })
  }, [jdText, resumeText])

  const annotated = useMemo(()=>{
    if (!result) return { jd: jdText, resume: resumeText }
    const highlights = new Set([...
      result.matchedSkills,
      ...result.matchedKeywords
    ])
    return {
      jd: annotateText(jdText, [...highlights]),
      resume: annotateText(resumeText, [...highlights])
    }
  }, [result, jdText, resumeText])

  const leaderboard = useMemo(() => {
    if (!jdText || batchResumes.length === 0) return []
    return batchResumes.map(r => {
      const res = analyze({ jdText, resumeText: r.text })
      const topMissing = (res.missingSkills || []).slice(0,3)
      return { candidateName: r.name || '-', score: res.score, topMissing }
    }).sort((a,b)=> b.score - a.score)
  }, [jdText, batchResumes])

  const handleExport = () => {
    if (!result) return
    downloadCSV({
      jdTitle,
      candidateName,
      score: result.score,
      matchedSkills: result.matchedSkills,
      suggestions: result.suggestedTop5,
    })
  }

  const handleExportPDF = () => {
    if (!result) return
    downloadPDF({
      jdTitle,
      candidateName,
      score: result.score,
      label: result.label,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      suggestions: result.suggestedTop5,
    })
  }

  const handleClearAll = () => {
    setJdTitle('')
    setCandidateName('')
    setJdText('')
    setResumeText('')
    setBatchResumes([])
  }

  return (
    <div>
      <Header onClearAll={handleClearAll} />
      <main className="container">
        <div className="grid">
          <div className="panel">
            <label htmlFor="jdTitle">Job Title (optional)</label>
            <input id="jdTitle" value={jdTitle} onChange={(e)=>setJdTitle(e.target.value)} placeholder="e.g., Senior Frontend Engineer" aria-label="Job Title" style={{width:'100%',padding:'10px',borderRadius:10,border:'1px solid rgba(148,163,184,0.25)',background:'#0b1220',color:'var(--text)'}} />
          </div>
          <div className="panel">
            <label htmlFor="candidate">Candidate Name (optional)</label>
            <input id="candidate" value={candidateName} onChange={(e)=>setCandidateName(e.target.value)} placeholder="e.g., Alex Johnson" aria-label="Candidate Name" style={{width:'100%',padding:'10px',borderRadius:10,border:'1px solid rgba(148,163,184,0.25)',background:'#0b1220',color:'var(--text)'}} />
          </div>
        </div>

        <div className="grid" style={{marginTop: 16}}>
          <TextInputBlock
            id="jd"
            label="Job Description"
            placeholder="Paste text, or upload TXT, PDF, or DOCX file"
            value={jdText}
            onChange={setJdText}
            onFileLoaded={setJdText}
            helper="Supports TXT, PDF, and DOCX files. Data persists in browser."
          />
          <TextInputBlock
            id="resume"
            label="Resume"
            placeholder="Paste text, or upload TXT, PDF, or DOCX file"
            value={resumeText}
            onChange={setResumeText}
            onFileLoaded={setResumeText}
            helper="Supports TXT, PDF, and DOCX files. Data persists in browser."
          />
        </div>

        <div className="panel" style={{marginTop:16}}>
          <label htmlFor="batch">Batch Mode – Upload multiple resumes (TXT/PDF/DOCX)</label>
          <TextInputBlock
            id="batch"
            label="Batch Resumes"
            placeholder="Drop or upload multiple resume files (TXT/PDF/DOCX)"
            value={''}
            onChange={()=>{}}
            onFileLoaded={(texts)=>{
              // create names as Candidate 1.. or from first line
              const next = (Array.isArray(texts) ? texts : [texts]).map((t, idx) => {
                const firstLine = (t.split(/\n/)[0] || '').trim()
                const inferred = firstLine && firstLine.length <= 80 ? firstLine : `Candidate ${idx+1}`
                return { name: inferred, text: t }
              })
              setBatchResumes(next)
            }}
            helper="Supports TXT, PDF, and DOCX. All data stays in your browser."
            multiple
          />

          {leaderboard.length > 0 && (
            <div style={{marginTop:12}}>
              <div style={{fontWeight:700, marginBottom:6}}>Leaderboard</div>
              <div className="panel" style={{padding:12}}>
                {leaderboard.map((row, idx) => (
                  <div key={idx} className="row" style={{justifyContent:'space-between'}}>
                    <div style={{fontWeight:600}}>{idx+1}. {row.candidateName}</div>
                    <div className={row.score>70? 'score good':'score '+(row.score>=40?'mid':'low')} style={{fontSize:18}}>{row.score}</div>
                    <div className="muted">Missing: {(row.topMissing||[]).join(', ') || '-'}</div>
                  </div>
                ))}
              </div>
              <div className="row" style={{marginTop:8}}>
                <button className="secondary" onClick={()=> downloadLeaderboardCSV(leaderboard)}>Export Leaderboard CSV</button>
              </div>
            </div>
          )}
        </div>

        <div style={{marginTop: 16}}>
          <ResultsPanel
            result={result}
            annotatedJD={annotated.jd}
            annotatedResume={annotated.resume}
            onExport={handleExport}
            onExportPDF={handleExportPDF}
          />
        </div>

        <div className="footer-note" aria-live="polite" style={{marginTop: 12}}>
          Score updates live as you type. Keyboard accessible. No data leaves your browser.
        </div>
      </main>
    </div>
  )
}



