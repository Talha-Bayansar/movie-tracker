import type { InferModel } from "drizzle-orm";
import { sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const favorites = sqliteTable("favorites", {
  id: integer("id").primaryKey(),
  movieId: integer("movieId"),
});

export type Favorite = InferModel<typeof favorites, "select">;
export type NewFavorite = InferModel<typeof favorites, "insert">;
