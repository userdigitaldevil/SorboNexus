-- CreateTable
CREATE TABLE "Ressource" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "filter" TEXT NOT NULL,
    "resourceUrl" TEXT,
    "format" TEXT,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ressource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ressource" ADD CONSTRAINT "Ressource_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
