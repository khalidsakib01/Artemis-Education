import { Router } from "express";
import { db } from "@workspace/db";
import {
  enrollmentsTable,
  lessonProgressTable,
  quizResultsTable,
  liveClassesTable,
  usersTable,
} from "@workspace/db";
import { eq, gte, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/dashboard/summary", requireAuth, async (req, res) => {
  const userId = (req as any).dbUserId;

  const enrollments = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.userId, userId));
  const progress = await db.select().from(lessonProgressTable).where(and(eq(lessonProgressTable.userId, userId), eq(lessonProgressTable.completed, true)));
  const quizResults = await db.select().from(quizResultsTable).where(eq(quizResultsTable.userId, userId));
  const now = new Date();
  const upcomingLive = await db.select().from(liveClassesTable).where(gte(liveClassesTable.scheduledAt, now));
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  const avgScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((a, b) => a + b.score, 0) / quizResults.length)
    : 0;
  const completedCourses = enrollments.filter((e) => e.progressPercent === 100).length;

  const recentActivity = [
    ...progress.slice(-3).map((p) => ({
      type: "lesson_completed" as const,
      titleBn: "পাঠ সম্পন্ন",
      titleEn: "Lesson Completed",
      timestamp: p.completedAt?.toISOString() ?? new Date().toISOString(),
      points: 10,
    })),
    ...quizResults.slice(-2).map((q) => ({
      type: "quiz_taken" as const,
      titleBn: "কুইজ সম্পন্ন",
      titleEn: "Quiz Taken",
      timestamp: q.submittedAt.toISOString(),
      points: q.score,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json({
    enrolledCourses: enrollments.length,
    completedCourses,
    totalLessonsCompleted: progress.length,
    totalQuizzesTaken: quizResults.length,
    averageQuizScore: avgScore,
    currentStreak: user?.totalPoints ? Math.min(7, Math.floor(user.totalPoints / 100)) : 0,
    totalPoints: user?.totalPoints ?? 0,
    upcomingLiveClasses: upcomingLive.length,
    recentActivity,
  });
});

router.get("/dashboard/streak", requireAuth, async (req, res) => {
  const userId = (req as any).dbUserId;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  const currentStreak = user?.totalPoints
    ? Math.min(14, Math.floor(user.totalPoints / 80))
    : 0;

  res.json({
    currentStreak,
    longestStreak: currentStreak + 2,
    studiedToday: currentStreak > 0,
    weeklyActivity: [true, true, false, true, true, true, true].map((_, i) => i < currentStreak % 7),
  });
});

export default router;
