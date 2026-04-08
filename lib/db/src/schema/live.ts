import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const liveClassesTable = pgTable("live_classes", {
  id: serial("id").primaryKey(),
  titleBn: text("title_bn").notNull(),
  titleEn: text("title_en").notNull(),
  instructor: text("instructor").notNull(),
  instructorAvatar: text("instructor_avatar"),
  subject: text("subject").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  joinUrl: text("join_url"),
  isLive: boolean("is_live").notNull().default(false),
  enrolledCount: integer("enrolled_count").notNull().default(0),
  courseId: integer("course_id"),
});

export const insertLiveClassSchema = createInsertSchema(liveClassesTable).omit({ id: true });
export type InsertLiveClass = z.infer<typeof insertLiveClassSchema>;
export type LiveClass = typeof liveClassesTable.$inferSelect;
