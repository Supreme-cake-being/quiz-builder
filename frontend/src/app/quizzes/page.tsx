"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

interface Quiz {
  id: number;
  title: string;
  questionCount: number;
}

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch quizzes
  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`);
      if (!res.ok) throw new Error("Failed to fetch quizzes");
      const data = await res.json();
      setQuizzes(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Delete quiz
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete quiz");

      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading quizzes...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Error loading quizzes: {error}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Quizzes</h1>
        <Link
          href="/quizzes/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Create Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <p className="text-gray-500 text-center">No quizzes found.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="flex items-center justify-between bg-white rounded-xl shadow p-4 hover:shadow-md transition"
            >
              <Link
                href={`/quizzes/${quiz.id}`}
                className="flex flex-col text-gray-800 hover:text-blue-600"
              >
                <span className="text-lg font-semibold">{quiz.title}</span>
                <span className="text-sm text-gray-500">
                  {quiz.questionCount}{" "}
                  {quiz.questionCount === 1 ? "question" : "questions"}
                </span>
              </Link>

              <button
                onClick={() => handleDelete(quiz.id)}
                className="text-red-500 hover:text-red-700 transition p-2"
                title="Delete quiz"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
