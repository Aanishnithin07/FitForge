import React, { useMemo, useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import TextInputBlock from './components/TextInputBlock.jsx'
import ResultsPanel from './components/ResultsPanel.jsx'
import HelpModal from './components/HelpModal.jsx'
import ComparisonMode from './components/ComparisonMode.jsx'
import { analyze, annotateText } from './utils/analyzer.js'
import { downloadCSV, downloadPDF, downloadLeaderboardCSV } from './utils/export.js'
import { initCursorEffect, destroyCursorEffect } from './utils/cursorEffect.js'
import { demoData } from './data/demoData.js'

export default function App() {
  const [showHelp, setShowHelp] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  
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
      return { 
        name: r.name || '-',
        candidateName: r.name || '-', 
        score: res.score, 
        topMissing,
        ...res  // Include full analysis for comparison
      }
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
  
  const handleLoadDemo = () => {
    setJdTitle(demoData.jdTitle)
    setCandidateName(demoData.candidateName)
    setJdText(demoData.jdText)
    setResumeText(demoData.resumeText)
    setBatchResumes([])
  }

  return (
    <div>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      {showComparison && <ComparisonMode candidates={leaderboard} onClose={() => setShowComparison(false)} />}
      <Header onClearAll={handleClearAll} onShowHelp={() => setShowHelp(true)} />
      
      {/* Hero section with demo button */}
      {!jdText && !resumeText && (
        <div className="hero-banner" style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
          borderRadius: '20px',
          margin: '20px auto',
          maxWidth: '1200px',
          border: '1px solid rgba(34, 211, 238, 0.2)'
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px', background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome to FitForge
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
            AI-Powered Resume-Job Matching Platform for HR Professionals
          </p>
          <button 
            onClick={handleLoadDemo}
            style={{
              padding: '14px 32px',
              fontSize: '18px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(34, 211, 238, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            🎯 Try Demo with Sample Data
          </button>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '16px' }}>
            Or scroll down to upload your own job description and resume
          </p>
        </div>
      )}
      
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
            <div style={{marginTop: 24, animation: 'fadeIn 0.6s ease'}}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>🏆</span>
                Candidate Leaderboard
                <span style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'var(--text-muted)',
                  marginLeft: '8px'
                }}>
                  ({leaderboard.length} candidates)
                </span>
              </h3>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {leaderboard.map((row, idx) => {
                  const rankColors = {
                    0: { bg: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.05) 100%)', border: 'rgba(255, 215, 0, 0.4)', icon: '🥇' },
                    1: { bg: 'linear-gradient(135deg, rgba(192, 192, 192, 0.2) 0%, rgba(192, 192, 192, 0.05) 100%)', border: 'rgba(192, 192, 192, 0.4)', icon: '🥈' },
                    2: { bg: 'linear-gradient(135deg, rgba(205, 127, 50, 0.2) 0%, rgba(205, 127, 50, 0.05) 100%)', border: 'rgba(205, 127, 50, 0.4)', icon: '🥉' }
                  }
                  const rank = rankColors[idx] || { bg: 'var(--glass-bg)', border: 'var(--glass-border)', icon: `${idx + 1}` }
                  
                  return (
                    <div 
                      key={idx} 
                      style={{
                        background: rank.bg,
                        border: `1px solid ${rank.border}`,
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.3s ease',
                        animation: `slideInLeft 0.4s ease ${idx * 0.1}s backwards`
                      }}
                    >
                      <div style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        minWidth: '40px',
                        textAlign: 'center'
                      }}>
                        {rank.icon}
                      </div>
                      
                      <div style={{flex: 1}}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          marginBottom: '4px',
                          color: 'var(--text-bright)'
                        }}>
                          {row.candidateName}
                        </div>
                        {row.topMissing && row.topMissing.length > 0 && (
                          <div style={{
                            fontSize: '13px',
                            color: 'var(--text-muted)'
                          }}>
                            Missing: {row.topMissing.slice(0, 3).join(', ')}
                            {row.topMissing.length > 3 && ` +${row.topMissing.length - 3} more`}
                          </div>
                        )}
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '4px'
                      }}>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: 700,
                          color: row.score >= 80 ? '#22c55e' : 
                                 row.score >= 60 ? '#22d3ee' :
                                 row.score >= 40 ? '#f59e0b' : '#ef4444'
                        }}>
                          {row.score}%
                        </div>
                        <div style={{
                          width: '120px',
                          height: '6px',
                          background: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${row.score}%`,
                            height: '100%',
                            background: row.score >= 80 ? 'linear-gradient(90deg, #22c55e, #10b981)' : 
                                       row.score >= 60 ? 'linear-gradient(90deg, #22d3ee, #06b6d4)' :
                                       row.score >= 40 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                            borderRadius: '3px',
                            transition: 'width 0.6s ease'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div style={{marginTop: 16, display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap'}}>
                <button 
                  onClick={() => setShowComparison(true)}
                  disabled={leaderboard.length < 2}
                  style={{
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: 600,
                    background: leaderboard.length < 2 ? 'rgba(148, 163, 184, 0.2)' : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    color: leaderboard.length < 2 ? 'var(--text-muted)' : 'white',
                    cursor: leaderboard.length < 2 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s ease',
                    opacity: leaderboard.length < 2 ? 0.5 : 1
                  }}
                >
                  <span>🔍</span>
                  Compare Candidates
                </button>
                
                <button 
                  onClick={() => downloadLeaderboardCSV(leaderboard)}
                  style={{
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <span>📥</span>
                  Export CSV
                </button>
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



