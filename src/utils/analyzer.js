// Text analysis utilities for FitForge
// Client-only; no external deps. All logic is transparent and tunable.

import skills from '../data/skills.json'

// Built-in minimal English stopword list. Extend as needed.
const STOPWORDS = new Set([
  'a','an','the','and','or','but','if','then','than','that','those','these','this','to','of','in','on','for','with','as','by','at','is','are','was','were','be','being','been','from','it','its','into','your','you','we','our','us','they','them','their','i','me','my','he','she','his','her','him','will','can','could','should','would','over','under','about','after','before','so','not','no','yes','do','does','did','done','have','has','had'
])

/** Normalize raw text: lowercase, remove punctuation, collapse whitespace */
export function normalize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extremely lightweight stemmer: trims common English suffixes.
 * This is intentionally simple to remain transparent to HR.
 */
export function stem(token) {
  let t = token
  if (t.length > 4 && /ing$/.test(t)) t = t.replace(/ing$/, '')
  if (t.length > 3 && /ed$/.test(t)) t = t.replace(/ed$/, '')
  if (t.length > 3 && /es$/.test(t)) t = t.replace(/es$/, '')
  if (t.length > 2 && /s$/.test(t)) t = t.replace(/s$/, '')
  return t
}

/** Tokenize, remove stopwords, apply stemming */
export function tokenize(text) {
  const norm = normalize(text)
  const tokens = norm.split(' ').filter(Boolean)
  const filtered = tokens.filter(t => !STOPWORDS.has(t))
  return filtered.map(stem)
}

/** Frequency map for tokens */
export function frequency(tokens) {
  const map = new Map()
  for (const t of tokens) {
    map.set(t, (map.get(t) || 0) + 1)
  }
  return map
}

/** Get top N tokens by frequency */
export function topTokens(tokens, limit = 25) {
  const map = frequency(tokens)
  return [...map.entries()]
    .sort((a,b)=> b[1]-a[1])
    .slice(0, limit)
    .map(([t])=>t)
}

/** Annotate text by wrapping matched words in <mark> */
export function annotateText(text, highlights) {
  const set = new Set(highlights)
  // Split preserving whitespace; highlight tokens that match exactly after normalization and stemming
  const words = text.split(/(\s+)/)
  return words.map(w => {
    const norm = normalize(w)
    const tok = norm ? stem(norm) : ''
    if (tok && set.has(tok)) {
      return `<mark aria-label="matched">${escapeHtml(w)}</mark>`
    }
    return escapeHtml(w)
  }).join('')
}

function escapeHtml(s) {
  return s
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
}

/**
 * Main analysis function. Returns:
 * { score, label, matchedSkills[], matchedKeywords[], missingSkills[], extraResumeSkills[], suggestedTop5[], breakdown, details: { jdTokens, resumeTokens } }
 *
 * Weights (tunable by HR):
 *  - skillWeight: 0.6
 *  - keywordWeight: 0.3
 *  - lengthWeight: 0.1
 */
export function analyze({ jdText, resumeText }) {
  const jdTokens = tokenize(jdText)
  const resumeTokens = tokenize(resumeText)

  // Curated skills matching - use normalized skilled tokens
  const skillTokens = new Set(skills.map(s => stem(normalize(s))))
  const jdSkillSet = new Set(jdTokens.filter(t => skillTokens.has(t)))
  const resumeSkillSet = new Set(resumeTokens.filter(t => skillTokens.has(t)))
  const skillMatches = [...jdSkillSet].filter(s => resumeSkillSet.has(s))
  const missingSkills = [...jdSkillSet].filter(s => !resumeSkillSet.has(s))
  const extraResumeSkills = [...resumeSkillSet].filter(s => !jdSkillSet.has(s))

  // Generic keyword overlap using top JD tokens
  const jdTop = new Set(topTokens(jdTokens, 30))
  const resumeSet = new Set(resumeTokens)
  const keywordMatches = [...jdTop].filter(t => resumeSet.has(t))

  // Suggestions: JD tokens that are not in resume
  const missing = [...jdTop].filter(t => !resumeSet.has(t))
  const suggestedTop5 = missing.slice(0, 5)

  // Scores
  const skillOverlap = jdSkillSet.size === 0 ? 0 : (skillMatches.length / jdSkillSet.size)
  const keywordOverlap = jdTop.size === 0 ? 0 : (keywordMatches.length / jdTop.size)
  // Missing critical terms metric: based on top JD tokens coverage
  const missingCriticalScore = keywordOverlap // coverage of critical JD tokens

  // Length heuristic: very short resumes (< 120 tokens) or very long (> 1200) get penalized
  const resumeLen = resumeTokens.length
  let lengthScore = 1
  if (resumeLen < 120) {
    lengthScore = Math.max(0, resumeLen / 120)
  } else if (resumeLen > 1200) {
    lengthScore = Math.max(0, 1 - (resumeLen - 1200) / 1200)
  }

  // Weights (tunable)
  const skillWeight = 0.7
  const missingCriticalWeight = 0.2
  const lengthWeight = 0.1

  let composite = (
    skillOverlap * skillWeight +
    missingCriticalScore * missingCriticalWeight +
    lengthScore * lengthWeight
  )

  // Ensure strong overlaps score decently even if some terms are missing
  if (skillOverlap >= 0.85 && composite < 0.6) {
    composite = 0.6
  }

  const score = Math.round(Math.max(0, Math.min(1, composite)) * 100)
  const label = score > 70 ? 'Excellent' : score >= 40 ? 'Good' : 'Needs Review'

  return {
    score,
    label,
    matchedSkills: skillMatches,
    matchedKeywords: keywordMatches,
    missingSkills,
    extraResumeSkills,
    suggestedTop5,
    breakdown: {
      skillMatches: skillMatches.length,
      skillsInJD: jdSkillSet.size,
      skillsMissing: missingSkills.length,
      skillsExtra: extraResumeSkills.length,
    },
    details: { jdTokens: [...jdTop], resumeTokens: [...resumeSet] }
  }
}

export default {
  analyze,
  normalize,
  tokenize,
  annotateText,
}




