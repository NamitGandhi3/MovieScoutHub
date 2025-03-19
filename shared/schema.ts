import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favoriteMovies = pgTable("favorite_movies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  movieId: integer("movie_id").notNull(),
  posterPath: text("poster_path"),
  title: text("title").notNull(),
  rating: text("rating"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertFavoriteMovieSchema = createInsertSchema(favoriteMovies).pick({
  userId: true,
  movieId: true,
  posterPath: true,
  title: true,
  rating: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFavoriteMovie = z.infer<typeof insertFavoriteMovieSchema>;
export type FavoriteMovie = typeof favoriteMovies.$inferSelect;
