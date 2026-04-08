import { Router } from "express";
import { db } from "@workspace/db";
import {
  coursesTable,
  categoriesTable,
  modulesTable,
  lessonsTable,
} from "@workspace/db";
import { eq, ilike, and, sql } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  const categories = await db.select().from(categoriesTable);
  res.json(categories);
});

router.get("/courses", async (req, res) => {
  const { category, search, featured } = req.query;
  const conditions = [];

  if (category && typeof category === "string") {
    conditions.push(eq(coursesTable.category, category));
  }
  if (search && typeof search === "string") {
    conditions.push(ilike(coursesTable.titleBn, `%${search}%`));
  }
  if (featured === "true") {
    conditions.push(eq(coursesTable.isFeatured, true));
  }

  const courses = await db
    .select()
    .from(coursesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  res.json(
    courses.map((c) => ({
      ...c,
      price: Number(c.price),
      originalPrice: c.originalPrice ? Number(c.originalPrice) : undefined,
      rating: Number(c.rating),
    }))
  );
});

router.get("/courses/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, id));

  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const modules = await db
    .select()
    .from(modulesTable)
    .where(eq(modulesTable.courseId, id));

  const lessons = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.courseId, id));

  const modulesWithLessons = modules.map((m) => ({
    ...m,
    lessons: lessons.filter((l) => l.moduleId === m.id),
  }));

  res.json({
    ...course,
    price: Number(course.price),
    originalPrice: course.originalPrice ? Number(course.originalPrice) : undefined,
    rating: Number(course.rating),
    modules: modulesWithLessons,
  });
});

router.get("/courses/:id/lessons", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const lessons = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.courseId, id));

  res.json(lessons);
});

router.get("/lessons/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, id));

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  res.json(lesson);
});

export default router;
