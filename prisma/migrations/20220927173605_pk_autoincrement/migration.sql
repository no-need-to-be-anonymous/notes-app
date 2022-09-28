-- AlterTable
CREATE SEQUENCE "category_id_seq";
ALTER TABLE "category" ALTER COLUMN "id" SET DEFAULT nextval('category_id_seq');
ALTER SEQUENCE "category_id_seq" OWNED BY "category"."id";

-- AlterTable
CREATE SEQUENCE "note_id_seq";
ALTER TABLE "note" ALTER COLUMN "id" SET DEFAULT nextval('note_id_seq');
ALTER SEQUENCE "note_id_seq" OWNED BY "note"."id";

-- AlterTable
CREATE SEQUENCE "subcategory_id_seq";
ALTER TABLE "subcategory" ALTER COLUMN "id" SET DEFAULT nextval('subcategory_id_seq');
ALTER SEQUENCE "subcategory_id_seq" OWNED BY "subcategory"."id";
