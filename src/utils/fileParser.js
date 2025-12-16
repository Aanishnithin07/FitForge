import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

/**
 * Parse text from .txt files
 */
async function parseTxt(file) {
  return await file.text()
}

/**
 * Parse text from .docx files using mammoth
 */
async function parseDocx(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    
    if (result.messages.length > 0) {
      console.warn('DOCX parsing warnings:', result.messages)
    }
    
    return result.value
  } catch (error) {
    console.error('Error parsing DOCX:', error)
    throw new Error('Failed to parse DOCX file. Please ensure the file is not corrupted.')
  }
}

/**
 * Parse text from .pdf files using PDF.js
 */
async function parsePdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    
    let fullText = ''
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ')
      
      fullText += pageText + '\n'
    }
    
    return fullText.trim()
  } catch (error) {
    console.error('Error parsing PDF:', error)
    throw new Error('Failed to parse PDF file. Please ensure the file is not corrupted or password-protected.')
  }
}

/**
 * Detect file type and parse accordingly
 */
export async function parseFile(file) {
  if (!file) {
    throw new Error('No file provided')
  }
  
  const fileName = file.name.toLowerCase()
  const fileType = file.type.toLowerCase()
  
  // Detect file type by extension or MIME type
  if (fileName.endsWith('.txt') || fileType === 'text/plain') {
    return {
      text: await parseTxt(file),
      type: 'txt',
      name: file.name,
      size: file.size
    }
  } 
  else if (fileName.endsWith('.docx') || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return {
      text: await parseDocx(file),
      type: 'docx',
      name: file.name,
      size: file.size
    }
  }
  else if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
    return {
      text: await parsePdf(file),
      type: 'pdf',
      name: file.name,
      size: file.size
    }
  }
  else if (fileName.endsWith('.doc')) {
    throw new Error('Legacy .doc files are not supported. Please convert to .docx format.')
  }
  else {
    throw new Error(`Unsupported file type: ${fileName.split('.').pop()}. Supported formats: .txt, .pdf, .docx`)
  }
}

/**
 * Parse multiple files
 */
export async function parseFiles(files) {
  const results = []
  const errors = []
  
  for (const file of files) {
    try {
      const parsed = await parseFile(file)
      results.push(parsed)
    } catch (error) {
      errors.push({
        fileName: file.name,
        error: error.message
      })
    }
  }
  
  return { results, errors }
}

/**
 * Validate file before parsing
 */
export function validateFile(file, maxSizeMB = 10) {
  const maxSize = maxSizeMB * 1024 * 1024
  
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` }
  }
  
  const fileName = file.name.toLowerCase()
  const supportedExtensions = ['.txt', '.pdf', '.docx']
  const isSupported = supportedExtensions.some(ext => fileName.endsWith(ext))
  
  if (!isSupported) {
    return { 
      valid: false, 
      error: `Unsupported file type. Supported: ${supportedExtensions.join(', ')}` 
    }
  }
  
  return { valid: true }
}

/**
 * Get file icon based on type
 */
export function getFileIcon(fileName) {
  const name = fileName.toLowerCase()
  
  if (name.endsWith('.txt')) return '📄'
  if (name.endsWith('.pdf')) return '📕'
  if (name.endsWith('.docx')) return '📘'
  if (name.endsWith('.doc')) return '📗'
  
  return '📎'
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
