import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Get the date range for a bidding session
 * @param {number} session - Session number (1 or 2)
 * @returns {string} Date range string
 */
export function getSessionDate(session) {
  if (session === 1) return "16-17 Feb 2026"
  if (session === 2) return "17-18 Feb 2026"
  return ""
}


/**
 * Normalize layout name by extracting the base name (before first comma)
 * and removing block numbers to group similar layouts together
 * @param {string} layout - Full layout name
 * @returns {string} Normalized base layout name
 */
export function normalizeLayoutName(layout) {
  if (!layout) return ''
  // Extract base name (everything before first comma)
  let base = layout.split(',')[0].trim()
  
  // Remove "(Corner)" since it's now a separate type field
  base = base.replace(/\s*\(Corner\)\s*/gi, '').trim()
  
  // Remove block numbers (e.g., "1st Block", "2nd Block", etc.) to group layouts
  // Pattern: one or more digits followed by (st|nd|rd|th) followed by "Block" or "block"
  base = base.replace(/\s+\d+(st|nd|rd|th)\s+block\s*/gi, '').trim()
  
  // Normalize case: Title Case (capitalize first letter of each word)
  // But preserve acronyms (all caps words like "BSK", "BDA") and content in parentheses
  const parts = []
  let current = ''
  let inParens = false
  
  for (let i = 0; i < base.length; i++) {
    const char = base[i]
    if (char === '(') {
      if (current.trim()) {
        parts.push(current.trim())
        current = ''
      }
      inParens = true
      current += char
    } else if (char === ')') {
      current += char
      parts.push(current.trim())
      current = ''
      inParens = false
    } else {
      current += char
    }
  }
  if (current.trim()) {
    parts.push(current.trim())
  }
  
  const normalized = parts.map(part => {
    // Preserve content in parentheses as-is
    if (part.startsWith('(') && part.endsWith(')')) {
      return part
    }
    // Handle words
    const words = part.split(/\s+/)
    return words.map(word => {
      // If word is all caps (acronym), keep it as is
      if (word === word.toUpperCase() && word.length > 1) {
        return word
      }
      // Otherwise, capitalize first letter, lowercase rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    }).join(' ')
  }).join(' ')
  
  return normalized
}
