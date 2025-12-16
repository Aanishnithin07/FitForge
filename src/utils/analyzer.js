import skillsData from '../data/skills.json'

// Comprehensive stopwords list
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can',
  'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them',
  'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every',
  'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'just', 'don', 'now', 'd',
  'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn',
  'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren',
  'won', 'wouldn'
])

// Weights for scoring components
const SKILL_WEIGHT = 0.5
const KEYWORD_WEIGHT = 0.25
const CONTEXTUAL_WEIGHT = 0.15
const LENGTH_WEIGHT = 0.1

/**
 * Normalizes text: lowercase, remove punctuation, collapse whitespace
 */
function normalize(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[^\w\s+#/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Simple stemming: remove common suffixes
 */
function stem(word) {
  if (word.length < 4) return word
  return word
    .replace(/ing$/, '')
    .replace(/ed$/, '')
    .replace(/es$/, '')
    .replace(/s$/, '')
}

/**
 * Tokenize and filter stopwords
 */
function tokenize(text) {
  const normalized = normalize(text)
  return normalized
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOPWORDS.has(w))
    .map(stem)
}

/**
 * Extract n-grams (1-3 words) for better phrase matching
 */
function extractNGrams(text, maxN = 3) {
  const words = normalize(text).split(/\s+/).filter(w => w.length > 0)
  const ngrams = new Set()
  
  for (let n = 1; n <= Math.min(maxN, words.length); n++) {
    for (let i = 0; i <= words.length - n; i++) {
      const gram = words.slice(i, i + n).join(' ')
      if (gram.length > 2 && !STOPWORDS.has(gram)) {
        ngrams.add(gram)
      }
    }
  }
  
  return Array.from(ngrams)
}

/**
 * Calculate token frequency map
 */
function getFrequencyMap(tokens) {
  const freq = {}
  tokens.forEach(t => {
    freq[t] = (freq[t] || 0) + 1
  })
  return freq
}

/**
 * Match curated skills
 */
function matchSkills(jdText, resumeText) {
  const jdNorm = normalize(jdText)
  const resumeNorm = normalize(resumeText)
  
  const matched = []
  const missing = []
  
  skillsData.forEach(skill => {
    const skillNorm = normalize(skill)
    const inJD = jdNorm.includes(skillNorm)
    const inResume = resumeNorm.includes(skillNorm)
    
    if (inJD && inResume) {
      matched.push(skill)
    } else if (inJD && !inResume) {
      missing.push(skill)
    }
  })
  
  return { matched, missing }
}

/**
 * Extract top keywords from JD
 */
function extractKeywords(jdText, topN = 30) {
  const tokens = tokenize(jdText)
  const freq = getFrequencyMap(tokens)
  
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word)
}

/**
 * Match keywords between JD and resume
 */
function matchKeywords(jdKeywords, resumeText) {
  const resumeTokens = new Set(tokenize(resumeText))
  const matched = []
  const missing = []
  
  jdKeywords.forEach(keyword => {
    if (resumeTokens.has(keyword)) {
      matched.push(keyword)
    } else {
      missing.push(keyword)
    }
  })
  
  return { matched, missing }
}

/**
 * Contextual matching: check for similar phrases and synonyms
 */
function contextualMatch(jdText, resumeText) {
  const synonymMap = {
    'javascript': ['js', 'ecmascript', 'es6', 'es2015'],
    'typescript': ['ts'],
    'react': ['reactjs', 'react.js'],
    'node': ['nodejs', 'node.js'],
    'css': ['cascading style sheets', 'stylesheet'],
    'html': ['hypertext markup language', 'markup'],
    'database': ['db', 'databases', 'dbms'],
    'frontend': ['front-end', 'front end', 'ui development'],
    'backend': ['back-end', 'back end', 'server-side'],
    'fullstack': ['full-stack', 'full stack'],
    'api': ['rest api', 'restful', 'web service'],
    'docker': ['containerization', 'container'],
    'kubernetes': ['k8s', 'orchestration'],
    'aws': ['amazon web services', 'cloud'],
    'machine learning': ['ml', 'artificial intelligence', 'ai'],
  }
  
  let matches = 0
  const jdNorm = normalize(jdText)
  const resumeNorm = normalize(resumeText)
  
  Object.entries(synonymMap).forEach(([key, synonyms]) => {
    const hasInJD = jdNorm.includes(key) || synonyms.some(s => jdNorm.includes(s))
    const hasInResume = resumeNorm.includes(key) || synonyms.some(s => resumeNorm.includes(s))
    
    if (hasInJD && hasInResume) {
      matches++
    }
  })
  
  return matches
}

/**
 * Main analysis function
 */
export function analyze({ jdText, resumeText }) {
  if (!jdText || !resumeText) {
    return {
      score: 0,
      label: 'No data',
      matchedSkills: [],
      missingSkills: [],
      matchedKeywords: [],
      missingKeywords: [],
      suggestedTop5: [],
      details: {}
    }
  }
  
  // 1. Skill matching
  const { matched: matchedSkills, missing: missingSkills } = matchSkills(jdText, resumeText)
  const skillScore = skillsData.length > 0 
    ? (matchedSkills.length / skillsData.filter(s => normalize(jdText).includes(normalize(s))).length) * 100
    : 0
  
  // 2. Keyword matching
  const jdKeywords = extractKeywords(jdText)
  const { matched: matchedKeywords, missing: missingKeywords } = matchKeywords(jdKeywords, resumeText)
  const keywordScore = jdKeywords.length > 0
    ? (matchedKeywords.length / jdKeywords.length) * 100
    : 0
  
  // 3. Contextual matching
  const contextMatches = contextualMatch(jdText, resumeText)
  const contextScore = Math.min((contextMatches / 10) * 100, 100)
  
  // 4. Length heuristic
  const resumeTokens = tokenize(resumeText)
  let lengthScore = 0
  if (resumeTokens.length >= 150 && resumeTokens.length <= 1500) {
    lengthScore = 100
  } else if (resumeTokens.length < 150) {
    lengthScore = (resumeTokens.length / 150) * 100
  } else {
    lengthScore = Math.max(100 - ((resumeTokens.length - 1500) / 50), 0)
  }
  
  // Calculate final weighted score
  const finalScore = Math.round(
    (skillScore * SKILL_WEIGHT) +
    (keywordScore * KEYWORD_WEIGHT) +
    (contextScore * CONTEXTUAL_WEIGHT) +
    (lengthScore * LENGTH_WEIGHT)
  )
  
  // Determine label
  let label = 'Needs Review'
  if (finalScore >= 80) label = 'Excellent Match'
  else if (finalScore >= 60) label = 'Good Match'
  else if (finalScore >= 40) label = 'Fair Match'
  
  // Top suggestions
  const suggestedTop5 = missingKeywords.slice(0, 5)
  
  // Extract additional insights
  const jdExperience = extractExperience(jdText)
  const resumeExperience = extractExperience(resumeText)
  const jdEducation = extractEducation(jdText)
  const resumeEducation = extractEducation(resumeText)
  const certifications = extractCertifications(resumeText)
  const atsScore = calculateATSScore(jdText, resumeText)
  
  // Experience match
  let experienceMatch = 'Unknown'
  if (jdExperience && resumeExperience) {
    if (resumeExperience >= jdExperience) {
      experienceMatch = 'Meets Requirements'
    } else if (resumeExperience >= jdExperience * 0.7) {
      experienceMatch = 'Close Match'
    } else {
      experienceMatch = 'Below Requirements'
    }
  }
  
  // Education match
  const eduHierarchy = { phd: 5, masters: 4, bachelors: 3, associates: 2, diploma: 1 }
  let educationMatch = 'Not Specified'
  if (jdEducation && resumeEducation) {
    const jdLevel = eduHierarchy[jdEducation] || 0
    const resumeLevel = eduHierarchy[resumeEducation] || 0
    if (resumeLevel >= jdLevel) {
      educationMatch = 'Meets Requirements'
    } else {
      educationMatch = 'Below Requirements'
    }
  } else if (resumeEducation) {
    educationMatch = resumeEducation.charAt(0).toUpperCase() + resumeEducation.slice(1)
  }
  
  return {
    score: Math.min(finalScore, 100),
    label,
    matchedSkills,
    missingSkills,
    matchedKeywords,
    missingKeywords,
    suggestedTop5,
    atsScore,
    experience: {
      required: jdExperience,
      candidate: resumeExperience,
      match: experienceMatch
    },
    education: {
      required: jdEducation,
      candidate: resumeEducation,
      match: educationMatch
    },
    certifications,
    details: {
      skillScore: Math.round(skillScore),
      keywordScore: Math.round(keywordScore),
      contextScore: Math.round(contextScore),
      lengthScore: Math.round(lengthScore),
      resumeLength: resumeTokens.length
    }
  }
}

/**
 * Extract years of experience from text
 */
function extractExperience(text) {
  const patterns = [
    /(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:professional\s+)?experience/gi,
    /experience[:\s]*(\d+)\+?\s*(?:years?|yrs?)/gi,
    /(\d+)\+?\s*(?:years?|yrs?)\s+(?:in|with|of)/gi
  ]
  
  const matches = []
  patterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      matches.push(parseInt(match[1]))
    }
  })
  
  return matches.length > 0 ? Math.max(...matches) : null
}

/**
 * Extract education level from text
 */
function extractEducation(text) {
  const normalized = normalize(text)
  const educationLevels = {
    phd: ['ph.d', 'phd', 'doctorate', 'doctoral'],
    masters: ['master', 'msc', 'm.sc', 'mba', 'm.b.a', 'ms', 'm.s'],
    bachelors: ['bachelor', 'bsc', 'b.sc', 'ba', 'b.a', 'bs', 'b.s', 'beng', 'b.eng'],
    associates: ['associate', 'aa', 'a.a', 'as', 'a.s'],
    diploma: ['diploma', 'certificate']
  }
  
  for (const [level, keywords] of Object.entries(educationLevels)) {
    if (keywords.some(kw => normalized.includes(kw))) {
      return level
    }
  }
  
  return null
}

/**
 * Extract certifications from text
 */
function extractCertifications(text) {
  const certPatterns = [
    /(?:aws|amazon|azure|microsoft|google|oracle|cisco|comptia)\s+certified/gi,
    /certification[s]?[:\s]+([^\n]+)/gi,
    /cert(?:ified)?[:\s]+([^\n]+)/gi
  ]
  
  const certs = new Set()
  certPatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      certs.add(match[0].trim())
    }
  })
  
  return Array.from(certs).slice(0, 10)
}

/**
 * Calculate ATS (Applicant Tracking System) score
 */
function calculateATSScore(jdText, resumeText) {
  const jdNorm = normalize(jdText)
  const resumeNorm = normalize(resumeText)
  
  let score = 0
  let maxScore = 100
  
  // Contact information (10 points)
  const contactPatterns = [
    /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,  // email
    /\+?[\d\s()-]{10,}/,  // phone
    /linkedin\.com/i,  // LinkedIn
    /github\.com/i  // GitHub
  ]
  const contactScore = contactPatterns.filter(p => p.test(resumeText)).length * 2.5
  score += Math.min(contactScore, 10)
  
  // Proper sections (15 points)
  const sections = ['experience', 'education', 'skills', 'projects']
  const sectionScore = sections.filter(s => resumeNorm.includes(s)).length * 3.75
  score += Math.min(sectionScore, 15)
  
  // Keywords density (30 points)
  const jdKeywords = extractNGrams(jdText, 2)
  const matchedCount = jdKeywords.filter(kw => resumeNorm.includes(normalize(kw))).length
  const densityScore = (matchedCount / jdKeywords.length) * 30
  score += Math.min(densityScore, 30)
  
  // Readability (20 points)
  const resumeTokens = tokenize(resumeText)
  const readabilityScore = resumeTokens.length >= 150 && resumeTokens.length <= 1500 ? 20 : 10
  score += readabilityScore
  
  // Formatting indicators (10 points)
  const formatScore = [
    /^[A-Z\s]{3,50}$/m.test(resumeText),  // Header/name in caps
    /\d{4}\s*-\s*(\d{4}|present)/i.test(resumeText),  // Date ranges
    /•|·|\*|-/.test(resumeText),  // Bullet points
    resumeText.split('\n').length > 10  // Multiple lines
  ].filter(Boolean).length * 2.5
  score += Math.min(formatScore, 10)
  
  // Quantifiable achievements (15 points)
  const achievements = (resumeText.match(/\d+%|\d+\+|increased|improved|reduced|achieved/gi) || []).length
  const achievementScore = Math.min(achievements * 3, 15)
  score += achievementScore
  
  return Math.round(score)
}

/**
 * Annotate text with highlights for matched terms
 */
export function annotateText(text, highlights) {
  if (!text || !highlights || highlights.length === 0) return text
  
  let result = text
  const sortedHighlights = [...highlights].sort((a, b) => b.length - a.length)
  
  sortedHighlights.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi')
    result = result.replace(regex, (match) => `<mark>${match}</mark>`)
  })
  
  return result
}
