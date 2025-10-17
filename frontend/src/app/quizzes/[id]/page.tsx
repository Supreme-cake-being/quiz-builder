"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ChoiceType {
  id: number;
  choiceText: string;
  isCorrect: boolean;
}

interface QuestionType {
  id: number;
  type: string;
  questionText: string;
  correctAnswer: string | null;
  choices: ChoiceType[];
}

interface QuizType {
  id: number;
  title: string;
  questions: QuestionType[];
}

export default function QuizDetailPage() {
  const params = useParams();
  const quizId = params?.id;
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quizId}`
        );
        if (!res.ok) throw new Error("Failed to fetch quiz");
        const data = await res.json();
        setQuiz(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-800" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Error loading quiz: {error}
      </div>
    );

  if (!quiz)
    return (
      <div className="text-center text-gray-800 mt-10">Quiz not found</div>
    );

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">{quiz.title}</h1>

      <ul className="space-y-6">
        {quiz.questions.map((q) => (
          <li
            key={q.id}
            className="bg-white text-gray-800 shadow rounded-xl p-6"
          >
            <p className="text-lg font-semibold mb-3">{q.questionText}</p>

            {/* Render question types */}
            {q.type === "boolean" && (
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" disabled /> True
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" disabled /> False
                </label>
              </div>
            )}

            {q.type === "input" && (
              <input
                type="text"
                className="border text-gray-800 rounded px-3 py-2 w-full"
                value={q.correctAnswer || ""}
                readOnly
              />
            )}

            {q.type === "checkbox" && (
              <div className="flex flex-col gap-2">
                {q.choices.map((c) => (
                  <label key={c.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={c.isCorrect} disabled />
                    {c.choiceText}
                  </label>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
