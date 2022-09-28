/*
  Warnings:

  - A unique constraint covering the columns `[user_id,name]` on the table `category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "category_user_id_name_key" ON "category"("user_id", "name");
