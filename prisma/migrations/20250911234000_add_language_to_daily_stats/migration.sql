-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_daily_stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "ai_questions" INTEGER NOT NULL DEFAULT 0,
    "ai_summaries" INTEGER NOT NULL DEFAULT 0,
    "language" TEXT NOT NULL DEFAULT 'en'
);
INSERT INTO "new_daily_stats" ("ai_questions", "ai_summaries", "date", "id", "likes", "post_id", "views") SELECT "ai_questions", "ai_summaries", "date", "id", "likes", "post_id", "views" FROM "daily_stats";
DROP TABLE "daily_stats";
ALTER TABLE "new_daily_stats" RENAME TO "daily_stats";
CREATE UNIQUE INDEX "daily_stats_post_id_date_language_key" ON "daily_stats"("post_id", "date", "language");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
