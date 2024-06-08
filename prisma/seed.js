const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const test = await prisma.user.upsert({
    where: { email: "test@gmail.com" },
    update: {},
    create: {
      email: "test@gmail.com",
      name: "test",
      password: "$2b$10$1t0ft5S.Ux47AKN81TQn0eQkVWMSVfs/LCDiW8de5VMghKDBnB46m",
      games: {
        create: {
          game: {
            create: {
              id: 1,
              title: "Dota 2",
            },
          },
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
