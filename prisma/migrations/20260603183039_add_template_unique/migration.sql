/*
  Warnings:

  - A unique constraint covering the columns `[name,category]` on the table `Template` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Template_name_category_key" ON "Template"("name", "category");
