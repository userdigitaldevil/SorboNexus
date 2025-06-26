const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const gradients = [
  "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
  "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
  "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
  "linear-gradient(135deg, #fff 0%, #3b82f6 50%, #8b5cf6 100%)",
];
const fields = [
  "Informatique",
  "Mathématiques",
  "Droit",
  "Sciences",
  "Médecine",
  "Lettres",
  "Économie",
  "Physique",
  "Biologie",
  "Chimie",
];
const positions = [
  "Développeur Full-Stack",
  "Ingénieur Logiciel",
  "Chercheur",
  "Médecin",
  "Avocat",
  "Analyste financier",
  "Éditrice",
  "Chef de projet",
  "Consultant",
  "Professeur",
];
const conseils = [
  "N'attendez pas la fin de vos études pour réseauter. Participez aux événements, échangez avec vos pairs et osez demander conseil. Le réseau est une force inestimable pour votre avenir professionnel. Impliquez-vous dans des projets associatifs, développez vos compétences transversales et n'ayez pas peur de sortir de votre zone de confort. La curiosité et la persévérance sont vos meilleurs alliés pour réussir dans un monde en constante évolution. Enfin, gardez toujours à l'esprit que l'apprentissage ne s'arrête jamais, même après l'obtention de votre diplôme. Soyez proactif, ouvert d'esprit et prêt à saisir les opportunités qui se présentent à vous.",
  "Maîtrisez l'art de la présentation et de l'argumentation. Pratiquez devant vos pairs et filmez-vous pour progresser. La capacité à convaincre est essentielle dans le monde du droit. N'hésitez pas à participer à des concours d'éloquence, à rejoindre des clubs de débat et à solliciter des retours constructifs. L'expérience pratique, les stages et les rencontres avec des professionnels du secteur sont tout aussi importants que les connaissances théoriques. Restez humble, curieux et persévérant, car chaque échec est une occasion d'apprendre et de grandir.",
  "Développez votre curiosité intellectuelle. Lisez au-delà de votre domaine, explorez de nouvelles disciplines et ne craignez pas de poser des questions. Les découvertes les plus innovantes naissent souvent à l'intersection de plusieurs champs de connaissances. Impliquez-vous dans des projets de recherche, participez à des conférences et échangez avec des experts internationaux. La science est un voyage sans fin, où chaque étape vous rapproche un peu plus de la compréhension du monde qui vous entoure.",
  "Apprenez à gérer votre stress et à travailler sous pression. Le bien-être mental est aussi important que la réussite académique. N'hésitez pas à demander de l'aide, à pratiquer des activités relaxantes et à maintenir un équilibre entre vie professionnelle et personnelle. L'esprit d'équipe, la communication et l'adaptabilité sont des compétences clés dans le monde de l'entreprise. Soyez à l'écoute de vos collègues, partagez vos idées et osez prendre des initiatives.",
  "Cultivez votre créativité et votre curiosité. Lisez beaucoup, écrivez régulièrement et entourez-vous de personnes inspirantes. Les rencontres, les voyages et les expériences variées enrichissent votre vision du monde et nourrissent votre imagination. N'ayez pas peur de défendre vos idées, même si elles sortent des sentiers battus. La littérature est un miroir de la société, un outil de réflexion et un vecteur de changement.",
  "Maîtrisez au moins une langue étrangère. Les collaborations internationales sont de plus en plus fréquentes et la capacité à communiquer avec des partenaires du monde entier est un atout majeur. Participez à des échanges universitaires, voyagez autant que possible et soyez ouvert aux différences culturelles. La science n'a pas de frontières, et chaque rencontre est une opportunité d'apprendre et de s'enrichir.",
  "Développez votre esprit critique et votre empathie. Écoutez vos patients, comprenez leurs besoins et adaptez votre approche à chaque situation. La médecine est un métier exigeant, mais profondément humain. N'oubliez jamais que derrière chaque dossier se cache une histoire, une famille, un espoir. Formez-vous en continu, partagez vos connaissances et soutenez vos collègues dans les moments difficiles.",
  "Cultivez votre adaptabilité et votre capacité à apprendre de nouvelles technologies. Le secteur de l'informatique évolue à une vitesse fulgurante, et il est essentiel de rester à la pointe des innovations. Participez à des hackathons, contribuez à des projets open source et échangez avec la communauté. La curiosité, la rigueur et la passion sont les clés du succès dans ce domaine.",
  "Osez sortir de votre zone de confort, lancez-vous dans des projets ambitieux et ne craignez pas l'échec. Chaque expérience, même difficile, vous apportera des enseignements précieux. Entourez-vous de mentors, demandez des retours et soyez toujours prêt à remettre en question vos certitudes. L'humilité et la détermination sont les moteurs de la réussite.",
  "Investissez dans votre développement personnel, apprenez à vous connaître et à valoriser vos points forts. La confiance en soi se construit avec le temps, à force de travail et de persévérance. N'hésitez pas à solliciter l'aide de professionnels, à participer à des ateliers et à vous entourer de personnes bienveillantes. Le chemin vers la réussite est unique pour chacun, alors avancez à votre rythme et célébrez chaque victoire, aussi petite soit-elle.",
];

const themeColors = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#06b6d4", // teal
  "#10b981", // green
  "#6366f1", // indigo
  "#0ea5e9", // sky
  "#f59e42", // orange (muted)
  "#ef4444", // red (muted)
  "#64748b", // slate
  "#334155", // dark blue
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomYear() {
  return (2015 + Math.floor(Math.random() * 10)).toString();
}

function randomEmail(name) {
  return (
    name.toLowerCase().replace(/ /g, ".") +
    Math.floor(Math.random() * 1000) +
    "@sorbonne-universite.fr"
  );
}

function randomLinkedin(name) {
  return `https://linkedin.com/in/${name.toLowerCase().replace(/ /g, "")}`;
}

const futureGoalsList = [
  "M.Fin Princeton -> Quant trader",
  "ENS Ulm -> Professeur",
  "HEC Paris -> Consultant",
  "Polytechnique -> Ingénieur IA",
  "Sciences Po -> Journaliste",
  "Sorbonne -> Chercheur CNRS",
  "ESSEC -> Analyste financier",
  "CentraleSupélec -> Data scientist",
  "AgroParisTech -> Ingénieur agro",
  "ENSAE -> Statisticien",
  "ENS Lyon -> Enseignant-chercheur",
  "M2 Droit Assas -> Avocat d'affaires",
  "M1 Informatique Sorbonne -> Dev full-stack",
  "M2 Biologie Sorbonne -> Chercheur santé",
  "M2 Chimie Sorbonne -> Ingénieur chimiste",
];

const scienceFields = [
  "Informatique",
  "Mathématiques",
  "Physique",
  "Chimie",
  "Biologie",
  "Sciences de la Terre",
  "Sciences de l'Ingénieur",
  "Maths-Info",
  "Maths-Physique",
  "Physique-Chimie",
];
const industryPositions = [
  "Développeur Full-Stack",
  "Ingénieur Logiciel",
  "Data Scientist",
  "Chercheur",
  "Ingénieur R&D",
  "Consultant IT",
  "Analyste données",
  "Ingénieur systèmes",
  "Ingénieur IA",
  "Chef de projet technique",
];
const masterDegrees = [
  "Master Informatique",
  "Master Mathématiques",
  "Master Physique",
  "Master Chimie",
  "Master Biologie",
  "Master Sciences de la Terre",
  "Master Ingénierie",
  "Master Maths-Info",
  "Master Maths-Physique",
  "Master Physique-Chimie",
];
const licenceDegrees = [
  "Licence Informatique",
  "Licence Mathématiques",
  "Licence Physique",
  "Licence Chimie",
  "Licence Biologie",
  "Licence Sciences de la Terre",
  "Licence Ingénierie",
  "Licence Maths-Info",
  "Licence Maths-Physique",
  "Licence Physique-Chimie",
];
const doctoratDegrees = [
  "Doctorat Informatique",
  "Doctorat Mathématiques",
  "Doctorat Physique",
  "Doctorat Chimie",
  "Doctorat Biologie",
  "Doctorat Sciences de la Terre",
  "Doctorat Ingénierie",
  "Doctorat Maths-Info",
  "Doctorat Maths-Physique",
  "Doctorat Physique-Chimie",
];

async function main() {
  for (let i = 1; i <= 15; i++) {
    const name = `Alumni${i} Sorbonne`;
    const username = `alumni${i}`;
    const password = `Password${i}!Sorbonne`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const degree = `Licence Sorbonne Université (${randomYear()})`;
    const position = randomFrom(positions);
    const field = randomFrom(fields);
    const color = randomFrom(themeColors);
    const gradient = randomFrom(gradients);
    const linkedin = randomLinkedin(name);
    const email = randomEmail(name);
    const avatar = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    const conseil = randomFrom(conseils) + " " + randomFrom(conseils);
    const nationalities = [
      "Française",
      "Italienne",
      "Espagnole",
      "Allemande",
      "Portugaise",
      "Marocaine",
      "Chinoise",
      "Indienne",
      "Brésilienne",
      "Canadienne",
    ][Math.floor(Math.random() * 10)];
    const grades = [];
    for (let s = 1; s <= 6; s++) {
      grades.push({
        subject: `Semestre ${s}`,
        value: (10 + Math.random() * 10).toFixed(1),
      });
    }
    const schoolsApplied = [
      { name: "ENS Paris", status: "accepted" },
      { name: "Polytechnique", status: "rejected" },
      { name: "HEC Paris", status: "accepted" },
    ];
    const isAdmin = false;
    const futureGoals = randomFrom(futureGoalsList);
    await prisma.alumni.create({
      data: {
        name,
        degree,
        position,
        field,
        gradient,
        color,
        linkedin,
        email,
        avatar,
        conseil,
        nationalities: [nationalities],
        stagesWorkedContestsExtracurriculars:
          "Projet associatif, stage, concours",
        accountCreationDate: new Date(),
        futureGoals,
        anneeFinL3: randomYear(),
        hidden: false,
        isAdmin,
        grades: { create: grades },
        schoolsApplied: { create: schoolsApplied },
        users: {
          create: {
            username,
            password: hashedPassword,
            isAdmin,
          },
        },
      },
    });
    console.log(
      `Created alumni ${name} (username: ${username}, password: ${password})`
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
