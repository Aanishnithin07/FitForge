import React, { useState } from 'react'

/**
 * ResultsPanel displays the comprehensive analysis results with beautiful visualizations
 */
export default function ResultsPanel({ result, annotatedJD, annotatedResume, onExport, onExportPDF }) {
  const [activeTab, setActiveTab] = useState('overview')
  
  if (!result) {
    return (
      <div className="results-empty">
        <div className="empty-icon">📊</div>
        <h3>No Analysis Yet</h3>
        <p className="muted">Enter both a Job Description and Resume to see the magic happen</p>
      </div>
    )
  }
  
  const { score, label, matchedSkills, missingSkills, matchedKeywords, suggestedTop5, details } = result
  
  // Calculate percentage for circular progress
  const circumference = 2 * Math.PI * 54
  const progress = circumference - (score / 100) * circumference
  
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
              <span className="btn-icon">📥</span> Export CSV
            </button>
            <button onClick={onExportPDF} className="btn-secondary">
              <span className="btn-icon">📄</span> Export Report
            </button>
          </div>
        </div>
      </div>
      
      {/* Detailed Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-value">{details.skillScore}%</div>
          <div className="metric-label">Skill Match</div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{width: `${details.skillScore}%`}}></div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🔑</div>
          <div className="metric-value">{details.keywordScore}%</div>
          <div className="metric-label">Keyword Match</div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{width: `${details.keywordScore}%`}}></div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🧠</div>
          <div className="metric-value">{details.contextScore}%</div>
          <div className="metric-label">Context Match</div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{width: `${details.contextScore}%`}}></div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📝</div>
          <div className="metric-value">{details.resumeLength}</div>
          <div className="metric-label">Resume Tokens</div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{width: `${details.lengthScore}%`}}></div>
          </div>
        </div>
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
            <div className="results-grid">
              <div className="result-section">
                <h3>
                  <span className="section-icon">✅</span> Matched Skills ({matchedSkills.length})
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
                  <span className="section-icon">⚠️</span> Missing Skills ({missingSkills.length})
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
            
            {suggestedTop5.length > 0 && (
              <div className="suggestions-section">
                <h3>
                  <span className="section-icon">💡</span> Top 5 Recommendations
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
