import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").unique(),
  nameBn: text("name_bn").notNull().default("অজ্ঞাত ব্যবহারকারী"),
  nameEn: text("name_en").notNull().default("Unknown User"),
  phone: text("phone"),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  classLevel: text("class_level").default("HSC"),
  goal: text("goal").default("HSC 2026"),
  totalPoints: integer("total_points").notNull().default(0),
  badges: text("badges").array().notNull().default([]),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, joinedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
