import React, { useCallback, useRef, useState } from 'react'
import { parseFile, parseFiles, validateFile, getFileIcon, formatFileSize } from '../utils/fileParser'

/**
 * TextInputBlock - God-tier file input with support for TXT, PDF, DOCX
 * Features drag-and-drop, file validation, progress tracking, and stunning UI
 */
export default function TextInputBlock({ id, label, placeholder, value, onChange, onFileLoaded, helper, multiple = false }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [error, setError] = useState(null)

  const processFiles = useCallback(async (files) => {
    setError(null)
    setIsProcessing(true)
    setUploadProgress(0)
    
    try {
      if (multiple) {
        // Process multiple files
        const { results, errors } = await parseFiles(files)
        
        if (errors.length > 0) {
          setError(`${errors.length} file(s) failed to parse: ${errors.map(e => e.fileName).join(', ')}`)
        }
        
        if (results.length > 0) {
          const texts = results.map(r => r.text)
          onFileLoaded?.(texts)
          setUploadedFile({ count: results.length, type: 'multiple' })
        }
        
        setUploadProgress(100)
      } else {
        // Process single file
        const file = files[0]
        
        // Validate file
        const validation = validateFile(file)
        if (!validation.valid) {
          setError(validation.error)
          setIsProcessing(false)
          return
        }
        
        // Simulate progress for better UX
        setUploadProgress(30)
        
        const parsed = await parseFile(file)
        
        setUploadProgress(70)
        
        onFileLoaded?.(parsed.text)
        setUploadedFile(parsed)
        
        setUploadProgress(100)
      }
      
      // Clear progress after animation
      setTimeout(() => {
        setUploadProgress(0)
        setIsProcessing(false)
      }, 1000)
      
    } catch (err) {
      console.error('File processing error:', err)
      setError(err.message || 'Failed to process file')
      setIsProcessing(false)
      setUploadProgress(0)
    }
  }, [multiple, onFileLoaded])

  const handleDrop = useCallback(async (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    
    const files = Array.from(event.dataTransfer.files || [])
    if (files.length === 0) return
    
    await processFiles(files)
  }, [processFiles])

  const handleFile = useCallback(async (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return
    
    await processFiles(files)
    
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [processFiles])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    if (
      e.clientX <= rect.left ||
      e.clientX >= rect.right ||
      e.clientY <= rect.top ||
      e.clientY >= rect.bottom
    ) {
      setIsDragging(false)
    }
  }, [])

  const handleClearFile = useCallback(() => {
    setUploadedFile(null)
    setError(null)
    onChange('')
  }, [onChange])

  return (
    <div 
      className={`panel file-input-panel ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label htmlFor={id} className="file-label">
        <span className="label-icon">📁</span>
        {label}
      </label>
      
      <textarea
        id={id}
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        disabled={isProcessing}
        className={uploadedFile ? 'has-file' : ''}
      />
      
      <div className="file-upload-section">
        <div className="upload-controls">
          <label className="btn-upload" htmlFor={`${id}-file`}>
            <span className="btn-icon">
              {isProcessing ? '⏳' : '📤'}
            </span>
            <span>
              {isProcessing ? 'Processing...' : 'Upload File'}
            </span>
          </label>
          <input 
            id={`${id}-file`} 
            type="file" 
            accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            ref={inputRef} 
            onChange={handleFile} 
            multiple={multiple}
            disabled={isProcessing}
          />
          
          <div className={`dropzone-advanced ${isDragging ? 'active' : ''}`}>
            <div className="dropzone-icon">
              {isDragging ? '🎯' : '📥'}
            </div>
            <div className="dropzone-text">
              <strong>Drag & drop files here</strong>
              <span className="dropzone-subtext">
                or click to browse
              </span>
            </div>
            <div className="supported-formats">
              <span className="format-badge">📄 TXT</span>
              <span className="format-badge">📕 PDF</span>
              <span className="format-badge">📘 DOCX</span>
            </div>
          </div>
        </div>
        
        {isProcessing && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="progress-text">{uploadProgress}%</span>
          </div>
        )}
        
        {uploadedFile && !isProcessing && (
          <div className="uploaded-file-info">
            <div className="file-info-content">
              <span className="file-icon">{getFileIcon(uploadedFile.name || '')}</span>
              <div className="file-details">
                <div className="file-name">{uploadedFile.name || `${uploadedFile.count} files`}</div>
                <div className="file-meta">
                  {uploadedFile.size && (
                    <span className="file-size">{formatFileSize(uploadedFile.size)}</span>
                  )}
                  <span className="file-type">{uploadedFile.type?.toUpperCase()}</span>
                </div>
              </div>
            </div>
            <button 
              className="btn-clear" 
              onClick={handleClearFile}
              title="Clear file"
            >
              ✕
            </button>
          </div>
        )}
        
        {error && (
          <div className="upload-error">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}
      </div>
      
      {helper && (
        <div className="footer-note helper-text" aria-live="polite">
          <span className="helper-icon">💡</span>
          {helper}
        </div>
      )}
    </div>
  )
}




