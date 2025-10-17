"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QuestionType = "boolean" | "input" | "checkbox";

interface Choice {
  choiceText: string;
  isCorrect: boolean;
}

interface Question {
  type: QuestionType;
  questionText: string;
  correctAnswer?: string;
  choices?: Choice[];
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { type: "boolean", questionText: "", correctAnswer: "true" },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, updated: Partial<Question>) => {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, ...updated } : q))
    );
  };

  const addChoice = (qIndex: number) => {
    const q = questions[qIndex];
    if (!q.choices) q.choices = [];
    q.choices.push({ choiceText: "", isCorrect: false });
    updateQuestion(qIndex, { choices: q.choices });
  };

  const removeChoice = (qIndex: number, cIndex: number) => {
    const q = questions[qIndex];
    if (!q.choices) return;
    q.choices.splice(cIndex, 1);
    updateQuestion(qIndex, { choices: q.choices });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, questions }),
        }
      );

      if (!res.ok) throw new Error("Failed to create quiz");

      router.push("/quizzes");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-gray-800">
      <h1 className="text-3xl text-white font-bold mb-8 text-center">
        Create New Quiz
      </h1>

      <div className="bg-white rounded-xl shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Title */}
          <div>
            <label className="block font-semibold mb-2">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
              required
            />
          </div>

          {/* Questions */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Questions</h2>
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="border border-gray-200 rounded p-4 mb-4 bg-white shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">
                    Question {qIndex + 1}
                  </span>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    Remove
                  </button>
                </div>

                <div className="mb-2">
                  <label className="block mb-1">Question Type</label>
                  <select
                    value={q.type}
                    onChange={(e) =>
                      updateQuestion(qIndex, {
                        type: e.target.value as QuestionType,
                        choices: e.target.value === "checkbox" ? [] : undefined,
                        correctAnswer:
                          e.target.value === "boolean" ? "true" : "",
                      })
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-gray-800"
                  >
                    <option value="boolean">Boolean</option>
                    <option value="input">Input</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="block mb-1">Question Text</label>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) =>
                      updateQuestion(qIndex, { questionText: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
                    required
                  />
                </div>

                {q.type === "boolean" && (
                  <div className="mb-2">
                    <label className="block mb-1">Correct Answer</label>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) =>
                        updateQuestion(qIndex, {
                          correctAnswer: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-gray-800"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                )}

                {q.type === "input" && (
                  <div className="mb-2">
                    <label className="block mb-1">Correct Answer</label>
                    <input
                      type="text"
                      value={q.correctAnswer || ""}
                      onChange={(e) =>
                        updateQuestion(qIndex, {
                          correctAnswer: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
                      required
                    />
                  </div>
                )}

                {q.type === "checkbox" && (
                  <div className="mb-2">
                    <label className="block mb-1">Choices</label>
                    {q.choices?.map((c, cIndex) => (
                      <div
                        key={cIndex}
                        className="flex items-center gap-2 mb-1"
                      >
                        <input
                          type="text"
                          value={c.choiceText}
                          onChange={(e) => {
                            const newChoices = [...(q.choices || [])];
                            newChoices[cIndex].choiceText = e.target.value;
                            updateQuestion(qIndex, { choices: newChoices });
                          }}
                          className="border border-gray-300 rounded px-2 py-1 flex-1 text-gray-800"
                          required
                        />
                        <label className="flex items-center gap-1 text-gray-800">
                          <input
                            type="checkbox"
                            checked={c.isCorrect}
                            onChange={(e) => {
                              const newChoices = [...(q.choices || [])];
                              newChoices[cIndex].isCorrect = e.target.checked;
                              updateQuestion(qIndex, { choices: newChoices });
                            }}
                          />
                          Correct
                        </label>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeChoice(qIndex, cIndex)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-1 text-blue-600 hover:text-blue-800"
                      onClick={() => addChoice(qIndex)}
                    >
                      + Add Choice
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={addQuestion}
            >
              + Add Question
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Creating..." : "Create Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
}
