import express from "express";
import cors from "cors";
import "dotenv/config";
import quizRouter from "routes/quizRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/quizzes", quizRouter);

app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ message: "Not found" });
});

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const status = err.status || 500;
    const message = err.message || "Server error";
    res.status(status).json({ message });
  }
);

export default app;
