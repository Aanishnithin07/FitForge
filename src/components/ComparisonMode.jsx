import React, { useState } from 'react'
import SkillRadarChart from './SkillRadarChart.jsx'

/**
 * Side-by-side candidate comparison tool
 */
export default function ComparisonMode({ candidates, onClose }) {
  const [selectedA, setSelectedA] = useState(0)
  const [selectedB, setSelectedB] = useState(1)
  
  if (!candidates || candidates.length < 2) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: 'var(--text-muted)'
      }}>
        Need at least 2 candidates to compare. Upload resumes in batch mode.
      </div>
    )
  }
  
  const candidateA = candidates[selectedA]
  const candidateB = candidates[selectedB]
  
  const radarDataA = [
    { label: 'Skills', value: candidateA.details.skillScore },
    { label: 'Keywords', value: candidateA.details.keywordScore },
    { label: 'Context', value: candidateA.details.contextScore },
    { label: 'ATS', value: candidateA.atsScore || 0 },
    { label: 'Experience', value: candidateA.experience?.candidate ? Math.min((candidateA.experience.candidate / 10) * 100, 100) : 0 },
  ]
  
  const radarDataB = [
    { label: 'Skills', value: candidateB.details.skillScore },
    { label: 'Keywords', value: candidateB.details.keywordScore },
    { label: 'Context', value: candidateB.details.contextScore },
    { label: 'ATS', value: candidateB.atsScore || 0 },
    { label: 'Experience', value: candidateB.experience?.candidate ? Math.min((candidateB.experience.candidate / 10) * 100, 100) : 0 },
  ]
  
  const ComparisonCard = ({ candidate, isA, radarData, selected, setSelected }) => (
    <div style={{
      flex: 1,
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      borderRadius: '16px',
      padding: '24px',
      minWidth: '300px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
          Candidate {isA ? 'A' : 'B'}
        </label>
        <select
          value={selected}
          onChange={(e) => setSelected(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            background: 'var(--bg)',
            color: 'var(--text)',
            fontSize: '14px'
          }}
        >
          {candidates.map((c, idx) => (
            <option key={idx} value={idx}>
              {c.name} ({c.score}%)
            </option>
          ))}
        </select>
      </div>
      
      <div style={{
        fontSize: '48px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px',
        color: candidate.score >= 80 ? '#22c55e' : 
               candidate.score >= 60 ? '#22d3ee' :
               candidate.score >= 40 ? '#f59e0b' : '#ef4444'
      }}>
        {candidate.score}%
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <SkillRadarChart data={radarData} size={250} />
      </div>
      
      <div style={{ display: 'grid', gap: '12px' }}>
        <MetricRow label="Skills" value={`${candidate.details.skillScore}%`} />
        <MetricRow label="Keywords" value={`${candidate.details.keywordScore}%`} />
        <MetricRow label="ATS Score" value={`${candidate.atsScore || 0}%`} />
        <MetricRow label="Experience" value={candidate.experience?.candidate ? `${candidate.experience.candidate}+ years` : 'N/A'} />
        <MetricRow label="Education" value={candidate.education?.candidate || 'N/A'} />
        <MetricRow label="Certifications" value={candidate.certifications?.length || 0} />
      </div>
    </div>
  )
  
  const MetricRow = ({ label, value }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 12px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '6px'
    }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: '14px' }}>{value}</span>
    </div>
  )
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      padding: '20px',
      overflow: 'auto',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '28px',
            background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🔍 Candidate Comparison
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '10px 20px',
              color: '#ef4444',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ✕ Close
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <ComparisonCard 
            candidate={candidateA} 
            isA={true}
            radarData={radarDataA}
            selected={selectedA}
            setSelected={setSelectedA}
          />
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            minWidth: '60px'
          }}>
            ⚡
          </div>
          
          <ComparisonCard 
            candidate={candidateB} 
            isA={false}
            radarData={radarDataB}
            selected={selectedB}
            setSelected={setSelectedB}
          />
        </div>
        
        <div style={{
          marginTop: '32px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>
            🎯 Key Differences
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <DifferenceCard
              label="Overall Score"
              valueA={`${candidateA.score}%`}
              valueB={`${candidateB.score}%`}
              winner={candidateA.score > candidateB.score ? 'A' : candidateB.score > candidateA.score ? 'B' : 'Tie'}
            />
            <DifferenceCard
              label="Skill Match"
              valueA={`${candidateA.details.skillScore}%`}
              valueB={`${candidateB.details.skillScore}%`}
              winner={candidateA.details.skillScore > candidateB.details.skillScore ? 'A' : candidateB.details.skillScore > candidateA.details.skillScore ? 'B' : 'Tie'}
            />
            <DifferenceCard
              label="Experience"
              valueA={candidateA.experience?.candidate ? `${candidateA.experience.candidate}+ yrs` : 'N/A'}
              valueB={candidateB.experience?.candidate ? `${candidateB.experience.candidate}+ yrs` : 'N/A'}
              winner={
                !candidateA.experience?.candidate ? 'B' :
                !candidateB.experience?.candidate ? 'A' :
                candidateA.experience.candidate > candidateB.experience.candidate ? 'A' :
                candidateB.experience.candidate > candidateA.experience.candidate ? 'B' : 'Tie'
              }
            />
            <DifferenceCard
              label="ATS Score"
              valueA={`${candidateA.atsScore || 0}%`}
              valueB={`${candidateB.atsScore || 0}%`}
              winner={(candidateA.atsScore || 0) > (candidateB.atsScore || 0) ? 'A' : (candidateB.atsScore || 0) > (candidateA.atsScore || 0) ? 'B' : 'Tie'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const DifferenceCard = ({ label, valueA, valueB, winner }) => (
  <div style={{
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px'
  }}>
    <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>{label}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontWeight: winner === 'A' ? 700 : 400, color: winner === 'A' ? '#22c55e' : 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {winner === 'A' && <span style={{display: 'inline-block', width: '16px', height: '16px', background: 'linear-gradient(135deg, #22c55e, #10b981)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)'}}></span>}
        {valueA}
      </span>
      <span style={{ color: 'var(--text-muted)' }}>vs</span>
      <span style={{ fontWeight: winner === 'B' ? 700 : 400, color: winner === 'B' ? '#22c55e' : 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {valueB}
        {winner === 'B' && <span style={{display: 'inline-block', width: '16px', height: '16px', background: 'linear-gradient(135deg, #22c55e, #10b981)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)'}}></span>}
      </span>
    </div>
  </div>
)
