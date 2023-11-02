const app = require("../app");
const request = require("supertest");
const prismaMock = require("../mocks/prismaMock");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const { beforeEach, describe } = require("@jest/globals");

jest.mock("jsonwebtoken");
jest.mock('bcrypt');


describe('Authentication',() => {
    beforeEach(()=>{
        jwt.sign.mockReset();
        bcrypt.hash.mockReset();
    })

    describe.only('/auth/register',() =>{
        it('creates a user and a token',async () =>{
            const newUser = {
                username : "Auth test",
                password : "authpassword"
            }

            const createdUser = {
                 id :1,
                 ...newUser
              }

              const token = "abcdefg";
              const hashedPassword = "hassedAuthPassword";

              bcrypt.hash.mockResolvedValue(hashedPassword);
              prismaMock.user.create.mockResolvedValue(createdUser);
              jwt.sign.mockReturnValue(token);

              const response = await request(app).post('/auth/register').send(newUser);
              console.log(response.body)
              expect(response.status).toBe(201);

        })
    })









})