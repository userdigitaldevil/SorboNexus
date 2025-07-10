-- AlterTable
ALTER TABLE "Alumni" ADD COLUMN     "bookmarkCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "bookmarkCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Ressource" ADD COLUMN     "bookmarkCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "itemType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bookmark_itemId_itemType_idx" ON "Bookmark"("itemId", "itemType");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_itemId_itemType_key" ON "Bookmark"("userId", "itemId", "itemType");

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
