import { Router } from "express";
import { db } from "@workspace/db";
import {
  quizzesTable,
  quizQuestionsTable,
  quizResultsTable,
  leaderboardTable,
  usersTable,
} from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/quizzes", async (req, res) => {
  const { courseId } = req.query;
  let quizzes;
  if (courseId) {
    quizzes = await db
      .select()
      .from(quizzesTable)
      .where(eq(quizzesTable.courseId, Number(courseId)));
  } else {
    quizzes = await db.select().from(quizzesTable);
  }
  res.json(quizzes);
});

router.get("/quizzes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [quiz] = await db
    .select()
    .from(quizzesTable)
    .where(eq(quizzesTable.id, id));

  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }

  const questions = await db
    .select()
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.quizId, id))
    .orderBy(quizQuestionsTable.order);

  res.json({
    ...quiz,
    questions: questions.map((q) => ({
      id: q.id,
      questionBn: q.questionBn,
      questionEn: q.questionEn,
      options: q.options,
      explanation: q.explanation,
    })),
  });
});

router.post("/quizzes/:id/submit", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const { answers } = req.body as { answers: Record<string, number> };

  const questions = await db
    .select()
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.quizId, id));

  let correctAnswers = 0;
  const answerResults = questions.map((q) => {
    const selected = answers[String(q.id)];
    const isCorrect = selected === q.correctOption;
    if (isCorrect) correctAnswers++;
    return {
      questionId: q.id,
      selectedOption: selected ?? -1,
      correctOption: q.correctOption,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const score = Math.round((correctAnswers / questions.length) * 100);
  const [quiz] = await db
    .select()
    .from(quizzesTable)
    .where(eq(quizzesTable.id, id));
  const passed = score >= (quiz?.passingScore ?? 60);

  res.json({
    score,
    totalQuestions: questions.length,
    correctAnswers,
    passed,
    answers: answerResults,
  });
});

router.get("/leaderboard", async (req, res) => {
  const entries = await db
    .select()
    .from(leaderboardTable)
    .orderBy(desc(leaderboardTable.totalPoints))
    .limit(20);

  res.json(
    entries.map((e, i) => ({
      rank: i + 1,
      userId: e.userId,
      userName: e.userName,
      avatarUrl: e.avatarUrl,
      totalPoints: e.totalPoints,
      quizzesCompleted: e.quizzesCompleted,
      streak: e.streak,
    }))
  );
});

export default router;
