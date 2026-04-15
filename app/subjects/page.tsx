import { getQuestions, getSubjects } from "@/lib/questions";

export default async function SubjectPage() {
  const questions = await getQuestions();
  const subjects = getSubjects(questions);

  return (
    <div>
      <h1>Pick a Subject</h1>
      {subjects.map((subject) => (
        <div key={subject.name}>
          {subject.name} — {subject.count} questions
        </div>
      ))}
    </div>
  );
}