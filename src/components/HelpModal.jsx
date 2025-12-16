import React from 'react'

/**
 * Help Modal Component
 * Provides users with instructions on how to use the application
 */
export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null
  
  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          animation: 'slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '20px',
            color: 'var(--text)',
            transition: 'all 0.3s ease'
          }}
          aria-label="Close help modal"
        >
          ✕
        </button>
        
        <h2 style={{
          fontSize: '28px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📚 How to Use FitForge
        </h2>
        
        <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚀</span> Quick Start
            </h3>
            <ol style={{ paddingLeft: '24px', lineHeight: 1.8 }}>
              <li>Click <strong>"Try Demo"</strong> to load sample data instantly</li>
              <li>Or manually paste/upload a job description and resume</li>
              <li>View comprehensive analysis results with scores and recommendations</li>
              <li>Export results as CSV or PDF report</li>
            </ol>
          </section>
          
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📁</span> Supported File Formats
            </h3>
            <ul style={{ paddingLeft: '24px', lineHeight: 1.8 }}>
              <li><strong>TXT</strong> - Plain text files</li>
              <li><strong>PDF</strong> - Portable Document Format (text extraction)</li>
              <li><strong>DOCX</strong> - Microsoft Word documents</li>
            </ul>
            <p style={{ marginTop: '12px', padding: '12px', background: 'rgba(34, 211, 238, 0.1)', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#22d3ee" strokeWidth="2"/>
                <path d="M12 16V12M12 8H12.01" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <strong>Tip:</strong> Drag and drop files directly onto the upload areas!
            </p>
          </section>
          
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="13" width="4" height="8" rx="1" fill="url(#helpGradient)"/>
                <rect x="10" y="8" width="4" height="13" rx="1" fill="url(#helpGradient)"/>
                <rect x="17" y="3" width="4" height="18" rx="1" fill="url(#helpGradient)"/>
                <defs><linearGradient id="helpGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
              </svg>
              Understanding Scores
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                <strong style={{ color: '#22c55e' }}>80-100% - Excellent Match</strong>
                <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--text-muted)' }}>
                  Outstanding candidate with strong skill alignment
                </p>
              </div>
              <div style={{ padding: '12px', background: 'rgba(34, 211, 238, 0.1)', borderRadius: '8px' }}>
                <strong style={{ color: '#22d3ee' }}>60-79% - Good Match</strong>
                <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--text-muted)' }}>
                  Solid candidate with most required skills
                </p>
              </div>
              <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                <strong style={{ color: '#f59e0b' }}>40-59% - Fair Match</strong>
                <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--text-muted)' }}>
                  Moderate fit with some skill gaps
                </p>
              </div>
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                <strong style={{ color: '#ef4444' }}>0-39% - Needs Review</strong>
                <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--text-muted)' }}>
                  Significant skill gaps identified
                </p>
              </div>
            </div>
          </section>
          
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎯</span> Key Metrics Explained
            </h3>
            <ul style={{ paddingLeft: '24px', lineHeight: 1.8 }}>
              <li><strong>Skill Match:</strong> Percentage of required technical skills found in resume</li>
              <li><strong>Keyword Match:</strong> Alignment of job description keywords with resume content</li>
              <li><strong>ATS Score:</strong> Applicant Tracking System compatibility (formatting, structure)</li>
              <li><strong>Experience:</strong> Years of professional experience compared to requirements</li>
              <li><strong>Education:</strong> Academic qualifications match</li>
              <li><strong>Certifications:</strong> Professional certifications detected</li>
            </ul>
          </section>
          
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👥</span> Batch Mode
            </h3>
            <p>Upload multiple resumes at once to compare candidates side-by-side. The leaderboard ranks candidates by match score.</p>
          </section>
          
          <section style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔒</span> Privacy & Data
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}>
              All processing happens <strong>locally in your browser</strong>. No data is sent to external servers. 
              Your job descriptions and resumes are stored only in your browser's local storage and can be cleared anytime.
            </p>
          </section>
        </div>
        
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  )
}
