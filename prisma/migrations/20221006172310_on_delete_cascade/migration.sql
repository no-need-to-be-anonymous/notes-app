-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_user_id_fkey";

-- DropForeignKey
ALTER TABLE "note" DROP CONSTRAINT "note_category_id_fkey";

-- DropForeignKey
ALTER TABLE "note" DROP CONSTRAINT "note_subcategory_id_fkey";

-- DropForeignKey
ALTER TABLE "subcategory" DROP CONSTRAINT "subcategory_category_id_fkey";

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
