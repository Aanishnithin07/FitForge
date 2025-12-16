import React, { useState } from 'react'
import SkillRadarChart from './SkillRadarChart.jsx'

/**
 * ResultsPanel displays the comprehensive analysis results with beautiful visualizations
 */
export default function ResultsPanel({ result, annotatedJD, annotatedResume, onExport, onExportPDF }) {
  const [activeTab, setActiveTab] = useState('overview')
  
  if (!result) {
    return (
      <div className="results-empty">
        <div className="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="13" width="4" height="8" rx="1" fill="url(#emptyGradient)"/>
            <rect x="10" y="8" width="4" height="13" rx="1" fill="url(#emptyGradient)"/>
            <rect x="17" y="3" width="4" height="18" rx="1" fill="url(#emptyGradient)"/>
            <defs>
              <linearGradient id="emptyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee"/>
                <stop offset="100%" stopColor="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h3>No Analysis Yet</h3>
        <p className="muted">Enter both a Job Description and Resume to see the magic happen</p>
      </div>
    )
  }
  
  const { score, label, matchedSkills, missingSkills, matchedKeywords, suggestedTop5, details, atsScore, experience, education, certifications } = result
  
  // Calculate percentage for circular progress
  const circumference = 2 * Math.PI * 54
  const progress = circumference - (score / 100) * circumference
  
  // Prepare radar chart data
  const radarData = [
    { label: 'Skills', value: details.skillScore },
    { label: 'Keywords', value: details.keywordScore },
    { label: 'Context', value: details.contextScore },
    { label: 'ATS', value: atsScore || 0 },
    { label: 'Experience', value: experience?.candidate ? Math.min((experience.candidate / 10) * 100, 100) : 0 },
  ]
  
  return (
    <div className="results-container">
      {/* Hero Score Section */}
      <div className="score-hero">
        <div className="score-circle-container">
          <svg className="score-circle" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="excellentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="goodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="fairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="lowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="54" className="score-circle-bg" />
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              className={`score-circle-progress score-${score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'low'}`}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: progress
              }}
            />
            <text x="60" y="60" className="score-text" textAnchor="middle" dominantBaseline="middle">
              {score}
            </text>
          </svg>
        </div>
        <div className="score-info">
          <h2 className="score-label">{label}</h2>
          <p className="score-description">
            {score >= 80 && "Outstanding fit! This candidate shows excellent alignment with the role requirements."}
            {score >= 60 && score < 80 && "Strong match! The candidate has most key skills and qualifications."}
            {score >= 40 && score < 60 && "Moderate fit. Consider if experience compensates for missing skills."}
            {score < 40 && "Limited match. Significant skill gaps identified."}
          </p>
          <div className="action-buttons">
            <button onClick={onExport} className="btn-primary">
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export CSV
            </button>
            <button onClick={onExportPDF} className="btn-secondary">
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>
      
      {/* Detailed Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="url(#skillGradient)" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill="url(#skillGradient)"/>
              <defs><linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
            </svg>
          </div>
          <div className="metric-value">{details.skillScore}%</div>
          <div className="metric-label">Skill Match</div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{width: `${details.skillScore}%`}}></div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="8" rx="2" stroke="url(#keyGradient)" strokeWidth="2"/>
              <circle cx="7" cy="7" r="2" stroke="url(#keyGradient)" strokeWidth="2"/>
              <path d="M7 9V11" stroke="url(#keyGradient)" strokeWidth="2"/>
              <defs><linearGradient id="keyGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
            </svg>
          </div>
          <div className="metric-value">{details.keywordScore}%</div>
          <div className="metric-label">Keyword Match</div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{width: `${details.keywordScore}%`}}></div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="url(#contextGradient)" strokeWidth="2" strokeLinejoin="round"/>
              <defs><linearGradient id="contextGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
            </svg>
          </div>
          <div className="metric-value">{details.contextScore}%</div>
          <div className="metric-label">Context Match</div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{width: `${details.contextScore}%`}}></div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="url(#docGradient)" strokeWidth="2"/>
              <path d="M14 2V8H20" stroke="url(#docGradient)" strokeWidth="2"/>
              <path d="M8 13H16" stroke="url(#docGradient)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 17H16" stroke="url(#docGradient)" strokeWidth="2" strokeLinecap="round"/>
              <defs><linearGradient id="docGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
            </svg>
          </div>
          <div className="metric-value">{details.resumeLength}</div>
          <div className="metric-label">Resume Tokens</div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{width: `${details.lengthScore}%`}}></div>
          </div>
        </div>
        
        {atsScore && (
          <div className="metric-card">
            <div className="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="url(#atsGradient)" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="url(#atsGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
              </svg>
            </div>
            <div className="metric-value">{atsScore}%</div>
            <div className="metric-label">ATS Score</div>
            <div className="metric-bar">
              <div className="metric-bar-fill" style={{width: `${atsScore}%`}}></div>
            </div>
          </div>
        )}
        
        {experience?.candidate && (
          <div className="metric-card">
            <div className="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="7" width="18" height="13" rx="2" stroke="url(#expGradient)" strokeWidth="2"/>
                <path d="M8 7V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V7" stroke="url(#expGradient)" strokeWidth="2"/>
                <defs><linearGradient id="expGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
              </svg>
            </div>
            <div className="metric-value">{experience.candidate}+ yrs</div>
            <div className="metric-label">Experience</div>
            <div className="metric-status" style={{
              color: experience.match === 'Meets Requirements' ? '#22c55e' : 
                     experience.match === 'Close Match' ? '#f59e0b' : '#ef4444'
            }}>
              {experience.match}
            </div>
          </div>
        )}
        
        {education?.candidate && (
          <div className="metric-card">
            <div className="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14L21 9L12 4L3 9L12 14Z" stroke="url(#eduGradient)" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M12 14V22" stroke="url(#eduGradient)" strokeWidth="2"/>
                <path d="M7 11.5V16L12 18.5L17 16V11.5" stroke="url(#eduGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="eduGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
              </svg>
            </div>
            <div className="metric-value" style={{fontSize: '16px', textTransform: 'capitalize'}}>
              {education.candidate}
            </div>
            <div className="metric-label">Education</div>
            <div className="metric-status" style={{
              color: education.match === 'Meets Requirements' ? '#22c55e' : '#f59e0b'
            }}>
              {education.match}
            </div>
          </div>
        )}
        
        {certifications && certifications.length > 0 && (
          <div className="metric-card">
            <div className="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="url(#certGradient)" strokeWidth="2"/>
                <circle cx="12" cy="15" r="3" stroke="url(#certGradient)" strokeWidth="2"/>
                <path d="M10.5 19L12 17.5L13.5 19" stroke="url(#certGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="certGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
              </svg>
            </div>
            <div className="metric-value">{certifications.length}</div>
            <div className="metric-label">Certifications</div>
            <div className="metric-status" style={{color: '#22c55e'}}>
              Found
            </div>
          </div>
        )}
      </div>
      
      {/* Tabs Navigation */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Skills Analysis
        </button>
        <button 
          className={`tab ${activeTab === 'highlights' ? 'active' : ''}`}
          onClick={() => setActiveTab('highlights')}
        >
          Text Highlights
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Radar Chart Visualization */}
            <div style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="13" width="4" height="8" rx="1" stroke="url(#chartGradient)" strokeWidth="2"/>
                  <rect x="10" y="8" width="4" height="13" rx="1" stroke="url(#chartGradient)" strokeWidth="2"/>
                  <rect x="17" y="3" width="4" height="18" rx="1" stroke="url(#chartGradient)" strokeWidth="2"/>
                  <defs><linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
                </svg>
                Skill Distribution Analysis
              </h3>
              <SkillRadarChart data={radarData} size={300} />
              <p style={{ 
                marginTop: '16px', 
                fontSize: '14px', 
                color: 'var(--text-muted)', 
                textAlign: 'center',
                maxWidth: '500px' 
              }}>
                Visual representation of candidate strengths across key evaluation dimensions. 
                Larger coverage indicates better overall fit.
              </p>
            </div>
            
            <div className="results-grid">
              <div className="result-section">
                <h3>
                  <span className="section-icon" style={{background: 'linear-gradient(135deg, #22c55e, #10b981)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600'}}>✓</span> Matched Skills ({matchedSkills.length})
                </h3>
                {matchedSkills.length > 0 ? (
                  <div className="chips">
                    {matchedSkills.map((skill, i) => (
                      <span key={i} className="chip chip-success">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p className="muted">No matched skills found</p>
                )}
              </div>
              
              <div className="result-section">
                <h3>
                  <span className="section-icon" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600'}}>!</span> Missing Skills ({missingSkills.length})
                </h3>
                {missingSkills.length > 0 ? (
                  <div className="chips">
                    {missingSkills.map((skill, i) => (
                      <span key={i} className="chip chip-warning">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p className="muted">All required skills found!</p>
                )}
              </div>
            </div>
            
            {certifications && certifications.length > 0 && (
              <div className="result-section" style={{gridColumn: '1 / -1'}}>
                <h3>
                  <span className="section-icon" style={{background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600'}}>C</span> Certifications Found ({certifications.length})
                </h3>
                <div className="chips">
                  {certifications.map((cert, i) => (
                    <span key={i} className="chip chip-info" style={{background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee', border: '1px solid rgba(34, 211, 238, 0.3)'}}>{cert}</span>
                  ))}
                </div>
              </div>
            )}
            
            {suggestedTop5.length > 0 && (
              <div className="suggestions-section">
                <h3>
                  <span className="section-icon" style={{background: 'linear-gradient(135deg, #a855f7, #9333ea)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600'}}>R</span> Top 5 Recommendations
                </h3>
                <ul className="suggestions-list">
                  {suggestedTop5.map((suggestion, i) => (
                    <li key={i} className="suggestion-item">
                      <span className="suggestion-number">{i + 1}</span>
                      <span className="suggestion-text">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'skills' && (
          <div className="skills-tab">
            <div className="skill-comparison">
              <div className="skill-column">
                <h3>Matched Keywords ({matchedKeywords.length})</h3>
                <div className="keyword-cloud">
                  {matchedKeywords.slice(0, 20).map((kw, i) => (
                    <span key={i} className="keyword-tag">{kw}</span>
                  ))}
                </div>
              </div>
              
              <div className="skill-divider"></div>
              
              <div className="skill-column">
                <h3>Gap Analysis</h3>
                <div className="gap-analysis">
                  <div className="gap-item">
                    <span className="gap-label">Skills Coverage</span>
                    <div className="gap-bar">
                      <div 
                        className="gap-bar-fill gap-bar-matched" 
                        style={{width: `${(matchedSkills.length / (matchedSkills.length + missingSkills.length || 1)) * 100}%`}}
                      ></div>
                    </div>
                    <span className="gap-percentage">
                      {Math.round((matchedSkills.length / (matchedSkills.length + missingSkills.length || 1)) * 100)}%
                    </span>
                  </div>
                  
                  <div className="gap-item">
                    <span className="gap-label">Keyword Coverage</span>
                    <div className="gap-bar">
                      <div 
                        className="gap-bar-fill gap-bar-keywords" 
                        style={{width: `${details.keywordScore}%`}}
                      ></div>
                    </div>
                    <span className="gap-percentage">{details.keywordScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'highlights' && (
          <div className="highlights-tab">
            <div className="results-grid">
              <div className="highlight-section">
                <h3>📋 Job Description (Highlighted)</h3>
                <div 
                  className="annotated" 
                  dangerouslySetInnerHTML={{ __html: annotatedJD }}
                />
              </div>
              
              <div className="highlight-section">
                <h3>👤 Resume (Highlighted)</h3>
                <div 
                  className="annotated" 
                  dangerouslySetInnerHTML={{ __html: annotatedResume }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
