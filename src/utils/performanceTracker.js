/**
 * Performance and Analytics Tracking
 * Tracks key metrics for application performance monitoring
 */

class PerformanceTracker {
  constructor() {
    this.metrics = {
      analysisCount: 0,
      averageAnalysisTime: 0,
      fileUploads: 0,
      pdfParses: 0,
      docxParses: 0,
      exports: 0,
      errors: 0,
      sessionStart: Date.now()
    }
    
    this.analysisTimings = []
    this.loadMetrics()
  }
  
  loadMetrics() {
    try {
      const saved = localStorage.getItem('fitforge_analytics')
      if (saved) {
        const data = JSON.parse(saved)
        this.metrics = { ...this.metrics, ...data }
      }
    } catch (e) {
      console.warn('Failed to load analytics:', e)
    }
  }
  
  saveMetrics() {
    try {
      localStorage.setItem('fitforge_analytics', JSON.stringify(this.metrics))
    } catch (e) {
      console.warn('Failed to save analytics:', e)
    }
  }
  
  trackAnalysis(duration) {
    this.metrics.analysisCount++
    this.analysisTimings.push(duration)
    
    // Keep only last 100 timings
    if (this.analysisTimings.length > 100) {
      this.analysisTimings.shift()
    }
    
    this.metrics.averageAnalysisTime = 
      this.analysisTimings.reduce((a, b) => a + b, 0) / this.analysisTimings.length
    
    this.saveMetrics()
  }
  
  trackFileUpload(fileType) {
    this.metrics.fileUploads++
    
    if (fileType === 'pdf') {
      this.metrics.pdfParses++
    } else if (fileType === 'docx') {
      this.metrics.docxParses++
    }
    
    this.saveMetrics()
  }
  
  trackExport(type) {
    this.metrics.exports++
    this.saveMetrics()
  }
  
  trackError(error) {
    this.metrics.errors++
    console.error('Tracked error:', error)
    this.saveMetrics()
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      sessionDuration: Date.now() - this.metrics.sessionStart
    }
  }
  
  getReport() {
    const metrics = this.getMetrics()
    const sessionMinutes = Math.round(metrics.sessionDuration / 60000)
    
    return {
      summary: `${metrics.analysisCount} analyses in ${sessionMinutes} minutes`,
      details: {
        'Total Analyses': metrics.analysisCount,
        'Avg Analysis Time': `${Math.round(metrics.averageAnalysisTime)}ms`,
        'File Uploads': metrics.fileUploads,
        'PDF Parses': metrics.pdfParses,
        'DOCX Parses': metrics.docxParses,
        'Exports': metrics.exports,
        'Errors': metrics.errors,
        'Session Duration': `${sessionMinutes} min`
      }
    }
  }
  
  reset() {
    this.metrics = {
      analysisCount: 0,
      averageAnalysisTime: 0,
      fileUploads: 0,
      pdfParses: 0,
      docxParses: 0,
      exports: 0,
      errors: 0,
      sessionStart: Date.now()
    }
    this.analysisTimings = []
    this.saveMetrics()
  }
}

// Singleton instance
const tracker = new PerformanceTracker()

// Auto-track page visibility changes
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      tracker.saveMetrics()
    }
  })
}

export default tracker
