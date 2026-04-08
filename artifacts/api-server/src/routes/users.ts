import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  enrollmentsTable,
  lessonProgressTable,
  coursesTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/users/profile", requireAuth, async (req, res) => {
  const userId = (req as any).dbUserId;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...user, joinedAt: user.joinedAt.toISOString() });
});

router.put("/users/profile", requireAuth, async (req, res) => {
  const userId = (req as any).dbUserId;
  const { nameBn, nameEn, classLevel, goal, avatarUrl } = req.body;
  const [updated] = await db
    .update(usersTable)
    .set({ nameBn, nameEn, classLevel, goal, avatarUrl })
    .where(eq(usersTable.id, userId))
    .returning();
  res.json({ ...updated, joinedAt: updated.joinedAt.toISOString() });
});

router.get("/users/enrollments", requireAuth, async (req, res) => {
  const userId = (req as any).dbUserId;
  const enrollments = await db
    .select()
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.userId, userId));

  const result = await Promise.all(
    enrollments.map(async (e) => {
      const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, e.courseId));
      return {
        ...e,
        enrolledAt: e.enrolledAt.toISOString(),
        course: course ? {
          ...course,
          price: Number(course.price),
          originalPrice: course.originalPrice ? Number(course.originalPrice) : undefined,
          rating: Number(course.rating),
        } : undefined,
      };
    })
  );
  res.json(result);
});

router.post("/users/enrollments", requireAuth, async (req, res) => {
  const userId = (req as any).dbUserId;
  const { courseId } = req.body;

  const [existing] = await db
    .select()
    .from(enrollmentsTable)
    .where(and(eq(enrollmentsTable.userId, userId), eq(enrollmentsTable.courseId, courseId)));

  if (existing) {
    res.status(201).json({ ...existing, enrolledAt: existing.enrolledAt.toISOString() });
    return;
  }

  const [enrollment] = await db
    .insert(enrollmentsTable)
    .values({ userId, courseId, progressPercent: 0, completedLessons: 0 })
    .returning();

  res.status(201).json({ ...enrollment, enrolledAt: enrollment.enrolledAt.toISOString() });
});

router.get("/users/progress", requireAuth, async (req, res) => {
  const userId = (req as any).dbUserId;
  const progress = await db
    .select()
    .from(lessonProgressTable)
    .where(eq(lessonProgressTable.userId, userId));

  res.json(progress.map((p) => ({
    ...p,
    completedAt: p.completedAt ? p.completedAt.toISOString() : undefined,
  })));
});

router.post("/users/progress", requireAuth, async (req, res) => {
  const userId = (req as any).dbUserId;
  const { lessonId, courseId, completed, watchedSeconds } = req.body;

  const [existing] = await db
    .select()
    .from(lessonProgressTable)
    .where(and(eq(lessonProgressTable.userId, userId), eq(lessonProgressTable.lessonId, lessonId)));

  let progress;
  if (existing) {
    const [updated] = await db
      .update(lessonProgressTable)
      .set({
        completed,
        watchedSeconds: watchedSeconds ?? existing.watchedSeconds,
        completedAt: completed ? new Date() : existing.completedAt,
      })
      .where(eq(lessonProgressTable.id, existing.id))
      .returning();
    progress = updated;
  } else {
    const [created] = await db
      .insert(lessonProgressTable)
      .values({
        userId,
        lessonId,
        courseId,
        completed,
        watchedSeconds: watchedSeconds ?? 0,
        completedAt: completed ? new Date() : undefined,
      })
      .returning();
    progress = created;
  }

  if (completed) {
    const allLessons = await db
      .select()
      .from(lessonProgressTable)
      .where(and(eq(lessonProgressTable.userId, userId), eq(lessonProgressTable.courseId, courseId)));
    const completedCount = allLessons.filter((l) => l.completed).length;
    await db
      .update(enrollmentsTable)
      .set({ completedLessons: completedCount })
      .where(and(eq(enrollmentsTable.userId, userId), eq(enrollmentsTable.courseId, courseId)));
  }

  res.json({ ...progress, completedAt: progress.completedAt ? progress.completedAt.toISOString() : undefined });
});

export default router;
