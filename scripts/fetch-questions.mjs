/**
 * Fetches questions from Google Sheets CSV and writes public/questions.json.
 * Run automatically before build and dev via package.json scripts.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Manually parse .env.local so we don't need a dotenv dependency
const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^([^#=][^=]*)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      if (!process.env[key]) process.env[key] = value
    }
  }
}

const url = process.env.GOOGLE_SHEET_CSV_URL

if (!url) {
  console.warn('⚠️  GOOGLE_SHEET_CSV_URL not set – skipping question fetch')
  process.exit(0)
}

const answerMap = { A: 0, B: 1, C: 2, D: 3 }

function normalizeDifficulty(value) {
  const v = value?.trim().toLowerCase()
  if (v === 'easy') return { difficulty: 'easy', tierLabel: 'Tier 1' }
  if (v === 'hard') return { difficulty: 'hard', tierLabel: 'Tier 3' }
  return { difficulty: 'medium', tierLabel: 'Tier 2' }
}

console.log('Fetching questions from Google Sheets…')

let csvText
try {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  csvText = await response.text()
} catch (err) {
  // If fetch fails (e.g. no internet), keep the existing file rather than failing the build
  const existing = join(process.cwd(), 'public', 'questions.json')
  if (existsSync(existing)) {
    console.warn(`⚠️  Could not fetch questions (${err.message}) – using existing questions.json`)
    process.exit(0)
  }
  console.error(`✗ Could not fetch questions and no existing file found: ${err.message}`)
  process.exit(1)
}

// Minimal CSV parser that matches the column headers in lib/questions.ts
const lines = csvText.split('\n')
const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))

function parseCSVLine(line) {
  const values = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  values.push(current.trim())
  return values
}

const questions = []

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim()
  if (!line) continue

  const values = parseCSVLine(line)
  const row = {}
  rawHeaders.forEach((h, idx) => { row[h] = values[idx] ?? '' })

  if (!row.questionText || !row.correct || !row.subject) {
    console.warn(`  Skipping row ${row.questionNumber || i}: missing required fields`)
    continue
  }

  const correctLetter = row.correct.trim().toUpperCase()
  if (!(correctLetter in answerMap)) {
    console.warn(`  Skipping row ${row.questionNumber || i}: invalid correct answer "${row.correct}"`)
    continue
  }

  const { difficulty, tierLabel } = normalizeDifficulty(row.difficulty)

  questions.push({
    id: parseInt(row.questionNumber) || i,
    subject: row.subject.trim(),
    topic: row.topic?.trim() || '',
    question: row.questionText.trim(),
    options: [
      row.optionA?.trim() || '',
      row.optionB?.trim() || '',
      row.optionC?.trim() || '',
      row.optionD?.trim() || '',
    ],
    correctIndex: answerMap[correctLetter],
    difficulty,
    tierLabel,
    explanation: row.explanation?.trim() || 'No explanation yet.',
  })
}

const outputPath = join(process.cwd(), 'public', 'questions.json')
writeFileSync(outputPath, JSON.stringify({ questions }, null, 2))

const subjects = [...new Set(questions.map(q => q.subject))]
console.log(`✓ Wrote ${questions.length} questions across ${subjects.length} topics to public/questions.json`)
