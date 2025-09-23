import React from 'react'

export default function Header() {
  return (
    <header role="banner" className="container" style={{paddingBottom: 0}}>
      <div className="brand">
        <div className="brand-badge" aria-hidden>FF</div>
        <div>
          <div style={{fontSize: 22, fontWeight: 800}}>FitForge</div>
          <div className="muted">Measure role-fit between a JD and a Resume</div>
        </div>
      </div>
      {/* Removed Deploy button for a cleaner header */}
    </header>
  )
}




