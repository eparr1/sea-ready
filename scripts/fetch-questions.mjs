/**
 * Fetches published questions from Supabase and writes public/questions.json.
 * Run automatically before build and dev via package.json scripts.
 *
 * Mapping: DB `topic` -> app `subject` (the cards on the Topics screen),
 *          DB `subtopic` -> app `topic` (the list inside a subject).
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const outputPath = join(process.cwd(), 'public', 'questions.json')

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase env vars not set – skipping question fetch')
  process.exit(0)
}

const answerMap = { a: 0, b: 1, c: 2, d: 3 }
const PAGE_SIZE = 1000

console.log('Fetching questions from Supabase…')

// RLS only returns status = 'published' rows to the anon/publishable key.
// Page through results because PostgREST caps responses at 1000 rows.
const rows = []
try {
  for (let from = 0; ; from += PAGE_SIZE) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/questions?select=*&status=eq.published&order=id`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Range: `${from}-${from + PAGE_SIZE - 1}`,
        },
      }
    )
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const page = await response.json()
    rows.push(...page)
    if (page.length < PAGE_SIZE) break
  }
} catch (err) {
  // If fetch fails (e.g. no internet), keep the existing file rather than failing the build
  if (existsSync(outputPath)) {
    console.warn(`⚠️  Could not fetch questions (${err.message}) – using existing questions.json`)
    process.exit(0)
  }
  console.error(`✗ Could not fetch questions and no existing file found: ${err.message}`)
  process.exit(1)
}

const questions = []

for (const row of rows) {
  const isImage = row.type === 'image_mcq'
  if (isImage && !row.image_file) {
    console.warn(`  Skipping ${row.id}: image question has no image_file`)
    continue
  }
  // Images live in public/question-images/<image_file>
  if (isImage && !existsSync(join(process.cwd(), 'public', 'question-images', row.image_file))) {
    console.warn(`  Warning: ${row.id} image "${row.image_file}" not found in public/question-images/`)
  }

  const options = [row.option_a, row.option_b, row.option_c, row.option_d]
    .map(o => o?.trim() ?? '')
    .filter(Boolean)
  const correctIndex = answerMap[row.correct_option]

  if (correctIndex === undefined || correctIndex >= options.length) {
    console.warn(`  Skipping ${row.id}: correct option "${row.correct_option}" has no matching answer`)
    continue
  }

  questions.push({
    id: row.id,
    subject: row.topic.trim(),
    topic: row.subtopic?.trim() || '',
    question: row.question.trim(),
    options,
    correctIndexes: [correctIndex],
    difficulty: 'medium',
    tierLabel: 'Tier 2',
    explanation: row.explanation?.trim() || 'No explanation yet.',
    ...(isImage && { image: `/question-images/${encodeURIComponent(row.image_file)}` }),
  })
}

writeFileSync(outputPath, JSON.stringify({ questions }, null, 2))

const subjects = [...new Set(questions.map(q => q.subject))]
console.log(`✓ Wrote ${questions.length} questions across ${subjects.length} subjects to public/questions.json`)
