const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { faker } = require("@faker-js/faker");

async function seed() {
  console.log("Seeding the database.");
  try {
    await Promise.all(
      [...Array(5)].map(() =>
        prisma.user.create({
          data: {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            posts: {
              create: [...Array(3)].map(() => ({
                title: faker.string.alpha({
                  length: { min: 10, max: 15 },
                  casing: "upper",
                }),
                content: faker.string.alpha({ length: { min: 15, max: 25 } }),
              })),
            },
          },
          include:{
            posts:true,
          }
        })
      )
    );
    console.log("Database is seeded");
  } catch (err) {
    console.error(err);
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

module.exports = seed;
