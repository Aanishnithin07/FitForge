import React, { useCallback, useRef } from 'react'

/**
 * TextInputBlock combines a labeled textarea with optional drag-and-drop
 * or button-based .txt upload. Emits text to parent via onChange.
 */
export default function TextInputBlock({ id, label, placeholder, value, onChange, onFileLoaded, helper, multiple = false }) {
  const inputRef = useRef(null)

  const handleDrop = useCallback(async (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files || [])
    const textFiles = files.filter(f => !f.type || f.type === 'text/plain')
    if (textFiles.length === 0) { alert('Please upload plain .txt files.'); return }
    if (multiple) {
      const contents = await Promise.all(textFiles.map(f => f.text()))
      onFileLoaded?.(contents)
    } else {
      const text = await textFiles[0].text()
      onFileLoaded?.(text)
    }
  }, [onFileLoaded])

  const handleFile = useCallback(async (event) => {
    const files = Array.from(event.target.files || [])
    const textFiles = files.filter(f => !f.type || f.type === 'text/plain')
    if (textFiles.length === 0) return
    if (multiple) {
      const contents = await Promise.all(textFiles.map(f => f.text()))
      onFileLoaded?.(contents)
    } else {
      const text = await textFiles[0].text()
      onFileLoaded?.(text)
    }
  }, [onFileLoaded])

  return (
    <div className="panel" onDragOver={(e)=>e.preventDefault()} onDrop={handleDrop}>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
      />
      <div className="row" style={{marginTop: 8}}>
        <label className="btn secondary" htmlFor={`${id}-file`}>
          Upload .txt{id==='batch' ? ' (multiple)' : ''}
        </label>
        <input id={`${id}-file`} type="file" accept=".txt,text/plain" ref={inputRef} onChange={handleFile} multiple={multiple} />
        <div className="dropzone" aria-label="Drop a .txt file here">…or drag & drop a .txt file</div>
      </div>
      {helper ? <div className="footer-note" aria-live="polite">{helper}</div> : null}
      {/* TODO: Support .docx via mammoth.js if needed. Keep client-only. */}
    </div>
  )
}




