/*
  Warnings:

  - A unique constraint covering the columns `[post_id,language]` on the table `post_stats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "post_stats_post_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "post_stats_post_id_language_key" ON "post_stats"("post_id", "language");
