/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Quiz` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Choice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "choiceText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "Choice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Choice" ("choiceText", "id", "isCorrect", "questionId") SELECT "choiceText", "id", "isCorrect", "questionId" FROM "Choice";
DROP TABLE "Choice";
ALTER TABLE "new_Choice" RENAME TO "Choice";
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionText" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "correctAnswer" TEXT,
    "quizId" INTEGER NOT NULL,
    CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("correctAnswer", "id", "questionText", "quizId", "type") SELECT "correctAnswer", "id", "questionText", "quizId", "type" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE TABLE "new_Quiz" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL
);
INSERT INTO "new_Quiz" ("id", "title") SELECT "id", "title" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
