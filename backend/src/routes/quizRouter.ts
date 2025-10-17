import quizController from "controllers/quizController";
import express from "express";
import { isEmptyBody, isValidId } from "middlewares";

const quizRouter = express.Router();

quizRouter.post("/", isEmptyBody, quizController.createQuiz);

quizRouter.get("/", quizController.getAllQuizzes);

quizRouter.get("/:id", isValidId("id"), quizController.getQuizById);

quizRouter.delete("/:id", isValidId("id"), quizController.deleteQuiz);

export default quizRouter;
