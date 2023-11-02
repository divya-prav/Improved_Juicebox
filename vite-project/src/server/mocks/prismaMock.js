const {mockDeep,mockReset} = require("jest-mock-extended");
const prisma = require('../client.js');





const prismaMock = prisma;

jest.mock('../client.js',()=> mockDeep())


beforeEach(()=>{
    mockReset(prismaMock)
})

module.exports = prismaMock;