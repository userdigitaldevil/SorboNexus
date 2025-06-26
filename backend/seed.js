const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.grade.deleteMany();
  await prisma.schoolApplied.deleteMany();
  await prisma.user.deleteMany();
  await prisma.alumni.deleteMany();

  // Create alumni with grades and schools applied
  const alumni1 = await prisma.alumni.create({
    data: {
      name: "Alice Example",
      degree: "DL Mathématiques - Informatique",
      position: "Software Engineer",
      field: "Informatique",
      linkedin: "https://linkedin.com/in/alice",
      email: "alice@example.com",
      avatar: "A",
      conseil: "Always keep learning!",
      nationalities: ["French"],
      hidden: false,
      isAdmin: true,
      grades: {
        create: [
          { subject: "Mathématiques", value: "18/20" },
          { subject: "Informatique", value: "19/20" },
        ],
      },
      schoolsApplied: {
        create: [
          { name: "ENS Paris", status: "Accepted" },
          { name: "Polytechnique", status: "Pending" },
        ],
      },
    },
    include: { grades: true, schoolsApplied: true },
  });
  const alumni2 = await prisma.alumni.create({
    data: {
      name: "Bob Demo",
      degree: "Licence Droit (2015)",
      position: "Lawyer",
      field: "Droit",
      linkedin: "https://linkedin.com/in/bob",
      email: "bob@example.com",
      avatar: "B",
      conseil: "Practice makes perfect.",
      nationalities: ["French"],
      hidden: false,
      isAdmin: false,
      grades: {
        create: [
          { subject: "Droit Civil", value: "16/20" },
          { subject: "Procédure", value: "17/20" },
        ],
      },
      schoolsApplied: {
        create: [
          { name: "Sorbonne", status: "Accepted" },
          { name: "Sciences Po", status: "Rejected" },
        ],
      },
    },
    include: { grades: true, schoolsApplied: true },
  });

  // Create users
  await prisma.user.create({
    data: {
      username: "alice",
      password: await bcrypt.hash("password123", 10),
      isAdmin: true,
      alumniId: alumni1.id,
    },
  });
  await prisma.user.create({
    data: {
      username: "bob",
      password: await bcrypt.hash("password123", 10),
      isAdmin: false,
      alumniId: alumni2.id,
    },
  });

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
