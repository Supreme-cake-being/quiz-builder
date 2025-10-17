import { ctrlWrapper } from "decorators";
import { Request, Response } from "express";
import { HttpError } from "helpers";
import { prisma } from "lib/prisma";

const createQuiz = async (req: Request, res: Response) => {
  const { title, questions } = req.body;

  const quiz = await prisma.quiz.create({
    data: {
      title,
      questions: {
        create: questions.map((q: any) => ({
          type: q.type,
          questionText: q.questionText,
          correctAnswer: q.correctAnswer ?? null,
          choices: q.choices
            ? {
                create: q.choices.map((c: any) => ({
                  choiceText: c.choiceText,
                  isCorrect: c.isCorrect,
                })),
              }
            : undefined,
        })),
      },
    },
    include: {
      questions: { include: { choices: true } },
    },
  });

  return res.status(201).json(quiz);
};

const getAllQuizzes = async (_req: Request, res: Response) => {
  console.log("all");

  const quizzes = await prisma.quiz.findMany({
    include: {
      _count: {
        select: { questions: true },
      },
    },
    orderBy: { id: "desc" },
  });

  const formatted = quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    questionCount: quiz._count.questions,
  }));

  res.status(200).json(formatted);
};

const getQuizById = async (req: Request, res: Response) => {
  console.log("by id");

  const { id } = req.params;
  const quizId = parseInt(id, 10);

  if (isNaN(quizId)) {
    throw HttpError(400, "Invalid quiz ID");
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          choices: true,
        },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!quiz) {
    throw HttpError(404, "Quiz not found");
  }

  res.status(200).json({
    id: quiz.id,
    title: quiz.title,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      questionText: q.questionText,
      correctAnswer: q.correctAnswer,
      choices: q.choices.map((c) => ({
        id: c.id,
        choiceText: c.choiceText,
        isCorrect: c.isCorrect,
      })),
    })),
  });
};

const deleteQuiz = async (req: Request, res: Response) => {
  const { id } = req.params;
  const quizId = parseInt(id, 10);

  const existingQuiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!existingQuiz) {
    throw HttpError(404, "Quiz not found");
  }

  await prisma.quiz.delete({
    where: { id: quizId },
  });

  res
    .status(200)
    .json({ message: `Quiz with ID ${quizId} deleted successfully.` });
};

export default {
  createQuiz: ctrlWrapper(createQuiz),
  getAllQuizzes: ctrlWrapper(getAllQuizzes),
  getQuizById: ctrlWrapper(getQuizById),
  deleteQuiz: ctrlWrapper(deleteQuiz),
};
