const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


async function createUser (newUser){
   const res = await prisma.user.create({
    data: newUser
  }) 
  console.log(res)
  return res;
}


module.exports = createUser;