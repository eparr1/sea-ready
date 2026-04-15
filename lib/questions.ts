import Papa from "papaparse";

// Matches YOUR Google Sheet headers exactly
type SheetRow = {
  questionNumber: string;
  subject: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: string;
  difficulty: string;
  explanation: string;
};

// Clean shape your app uses
export type Question = {
  id: number;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
  tierLabel: string;
  explanation: string;
};

const answerMap: Record<string, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

function normalizeDifficulty(value?: string) {
  const normalized = value?.trim().toLowerCase();

  if (normalized === "easy") {
    return { difficulty: "easy", tierLabel: "Tier 1" };
  }

  if (normalized === "hard") {
    return { difficulty: "hard", tierLabel: "Tier 3" };
  }

  return { difficulty: "medium", tierLabel: "Tier 2" };
}

export async function getQuestions(): Promise<Question[]> {
  const url = process.env.GOOGLE_SHEET_CSV_URL;

  if (!url) {
    throw new Error("GOOGLE_SHEET_CSV_URL is not set in .env.local");
  }

  const response = await fetch(url);
  const csvText = await response.text();

  const parsed = Papa.parse<SheetRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  const questions: Question[] = [];

  for (const row of parsed.data) {
    if (!row.questionText || !row.correct || !row.subject) {
      console.warn(`Skipping row ${row.questionNumber}: missing required fields`);
      continue;
    }

    const correctLetter = row.correct.trim().toUpperCase();

    if (!(correctLetter in answerMap)) {
      console.warn(`Skipping row ${row.questionNumber}: invalid correct answer "${row.correct}"`);
      continue;
    }

    const { difficulty, tierLabel } = normalizeDifficulty(row.difficulty);

    questions.push({
      id: parseInt(row.questionNumber) || 0,
      subject: row.subject.trim(),
      question: row.questionText.trim(),
      options: [
        row.optionA?.trim() || "",
        row.optionB?.trim() || "",
        row.optionC?.trim() || "",
        row.optionD?.trim() || "",
      ],
      correctIndex: answerMap[correctLetter],
      difficulty,
      tierLabel,
      explanation: row.explanation?.trim() || "No explanation yet.",
    });
  }

  console.log(`Loaded ${questions.length} questions across ${new Set(questions.map(q => q.subject)).size} subjects`);

  return questions;
}

// Helper to get unique subjects from the question bank
export function getSubjects(questions: Question[]) {
  const subjectMap = new Map<string, { name: string; count: number }>();

  for (const q of questions) {
    const existing = subjectMap.get(q.subject);
    if (existing) {
      existing.count++;
    } else {
      subjectMap.set(q.subject, {
        name: q.subject,
        count: 1,
      });
    }
  }

  return Array.from(subjectMap.values());
}

export function getTierLabels(questions: Question[]) {
  const tierMap = new Map<string, number>();

  for (const question of questions) {
    tierMap.set(question.tierLabel, (tierMap.get(question.tierLabel) ?? 0) + 1);
  }

  return Array.from(tierMap.entries()).map(([label, count]) => ({
    label,
    count,
  }));
}
