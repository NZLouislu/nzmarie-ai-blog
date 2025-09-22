-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_daily_stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "language" TEXT NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "reads" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "daily_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_daily_stats" ("id", "userId", "date", "language", "pageViews", "uniqueVisitors", "reads", "likes", "comments") SELECT "id", "user_id", "date", "language", "views", "unique_visitors", "reads", "likes", "comments" FROM "daily_stats";
DROP TABLE "daily_stats";
ALTER TABLE "new_daily_stats" RENAME TO "daily_stats";
CREATE INDEX "daily_stats_userId_date_idx" ON "daily_stats"("userId", "date");
CREATE UNIQUE INDEX "daily_stats_userId_date_language_key" ON "daily_stats"("userId", "date", "language");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;