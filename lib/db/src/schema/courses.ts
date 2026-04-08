import { pgTable, serial, text, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const categoriesTable = pgTable("categories", {
  id: text("id").primaryKey(),
  nameBn: text("name_bn").notNull(),
  nameEn: text("name_en").notNull(),
  icon: text("icon").notNull(),
  courseCount: integer("course_count").notNull().default(0),
});

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  titleBn: text("title_bn").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionBn: text("description_bn"),
  descriptionEn: text("description_en"),
  category: text("category").notNull(),
  instructor: text("instructor").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  totalLessons: integer("total_lessons").notNull().default(0),
  totalDuration: text("total_duration"),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("4.5"),
  enrolledCount: integer("enrolled_count").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  level: text("level").notNull().default("beginner"),
  tags: text("tags").array().notNull().default([]),
  syllabus: text("syllabus").array().notNull().default([]),
  requirements: text("requirements").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const modulesTable = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  titleBn: text("title_bn").notNull(),
  titleEn: text("title_en").notNull(),
  order: integer("order").notNull(),
});

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  moduleId: integer("module_id").notNull(),
  titleBn: text("title_bn").notNull(),
  titleEn: text("title_en").notNull(),
  type: text("type").notNull().default("video"),
  duration: text("duration"),
  videoUrl: text("video_url"),
  pdfUrl: text("pdf_url"),
  order: integer("order").notNull(),
  isFree: boolean("is_free").notNull().default(false),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true, createdAt: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;
