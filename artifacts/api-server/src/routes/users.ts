import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  enrollmentsTable,
  lessonProgressTable,
  coursesTable,
  liveClassesTable,
  quizResultsTable,
} from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

const DEFAULT_USER_ID = 1;

router.get("/users/profile", async (req, res) => {
  let [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, DEFAULT_USER_ID));

  if (!user) {
    const [created] = await db
      .insert(usersTable)
      .values({
        nameBn: "রাহেলা আক্তার",
        nameEn: "Rahela Akter",
        phone: "01712345678",
        email: "rahela@example.com",
        classLevel: "HSC",
        goal: "HSC 2026",
        totalPoints: 1250,
        badges: ["প্রথম কোর্স", "সাত দিনের স্ট্রিক", "কুইজ মাস্টার"],
      })
      .returning();
    user = created;
  }

  res.json({
    ...user,
    joinedAt: user.joinedAt.toISOString(),
  });
});

router.put("/users/profile", async (req, res) => {
  const { nameBn, nameEn, classLevel, goal, avatarUrl } = req.body;

  const [updated] = await db
    .update(usersTable)
    .set({ nameBn, nameEn, classLevel, goal, avatarUrl })
    .where(eq(usersTable.id, DEFAULT_USER_ID))
    .returning();

  res.json({
    ...updated,
    joinedAt: updated.joinedAt.toISOString(),
  });
});

router.get("/users/enrollments", async (req, res) => {
  const enrollments = await db
    .select()
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.userId, DEFAULT_USER_ID));

  const result = await Promise.all(
    enrollments.map(async (e) => {
      const [course] = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.id, e.courseId));
      return {
        ...e,
        enrolledAt: e.enrolledAt.toISOString(),
        course: course
          ? {
              ...course,
              price: Number(course.price),
              originalPrice: course.originalPrice
                ? Number(course.originalPrice)
                : undefined,
              rating: Number(course.rating),
            }
          : undefined,
      };
    })
  );

  res.json(result);
});

router.post("/users/enrollments", async (req, res) => {
  const { courseId, paymentId } = req.body;

  const [existing] = await db
    .select()
    .from(enrollmentsTable)
    .where(
      and(
        eq(enrollmentsTable.userId, DEFAULT_USER_ID),
        eq(enrollmentsTable.courseId, courseId)
      )
    );

  if (existing) {
    res.status(201).json({
      ...existing,
      enrolledAt: existing.enrolledAt.toISOString(),
    });
    return;
  }

  const [enrollment] = await db
    .insert(enrollmentsTable)
    .values({ userId: DEFAULT_USER_ID, courseId, progressPercent: 0, completedLessons: 0 })
    .returning();

  res.status(201).json({
    ...enrollment,
    enrolledAt: enrollment.enrolledAt.toISOString(),
  });
});

router.get("/users/progress", async (req, res) => {
  const progress = await db
    .select()
    .from(lessonProgressTable)
    .where(eq(lessonProgressTable.userId, DEFAULT_USER_ID));

  res.json(
    progress.map((p) => ({
      ...p,
      completedAt: p.completedAt ? p.completedAt.toISOString() : undefined,
    }))
  );
});

router.post("/users/progress", async (req, res) => {
  const { lessonId, courseId, completed, watchedSeconds } = req.body;

  const [existing] = await db
    .select()
    .from(lessonProgressTable)
    .where(
      and(
        eq(lessonProgressTable.userId, DEFAULT_USER_ID),
        eq(lessonProgressTable.lessonId, lessonId)
      )
    );

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
        userId: DEFAULT_USER_ID,
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
      .where(
        and(
          eq(lessonProgressTable.userId, DEFAULT_USER_ID),
          eq(lessonProgressTable.courseId, courseId)
        )
      );
    const completedCount = allLessons.filter((l) => l.completed).length;

    await db
      .update(enrollmentsTable)
      .set({ completedLessons: completedCount })
      .where(
        and(
          eq(enrollmentsTable.userId, DEFAULT_USER_ID),
          eq(enrollmentsTable.courseId, courseId)
        )
      );
  }

  res.json({
    ...progress,
    completedAt: progress.completedAt ? progress.completedAt.toISOString() : undefined,
  });
});

export default router;
