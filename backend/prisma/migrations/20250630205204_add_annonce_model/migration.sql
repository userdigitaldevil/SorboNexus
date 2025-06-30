-- CreateTable
CREATE TABLE "Annonce" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Annonce_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Annonce_createdAt_idx" ON "Annonce"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Annonce" ADD CONSTRAINT "Annonce_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
