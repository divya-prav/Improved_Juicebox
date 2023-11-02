const app = require("../../app");
const request = require("supertest");
const prismaMock = require("../../mocks/prismaMock");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');



jest.mock("jsonwebtoken");
jest.mock('bcrypt');


describe('Authentication',() => {
    beforeEach(()=>{
        jest.resetAllMocks();
        jwt.sign.mockReset();
        bcrypt.hash.mockReset();
    })

    describe('/auth/register',() =>{
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
              const hashedPassword = "hashedAuthPassword";

              bcrypt.hash.mockResolvedValue(hashedPassword);
              prismaMock.user.create.mockResolvedValue(createdUser);
              jwt.sign.mockReturnValue(token);

              const response = await request(app).post('/auth/register').send(newUser);
            
              expect(response.status).toBe(201);
              expect(response.body.newUser.id).toEqual(createdUser.id);
              expect(response.body.newUser.email).toEqual(createdUser.email);
              expect(response.body.token).toEqual(token);
              expect(response.body.newUser.password).toBeUndefined();
            
              expect(bcrypt.hash).toHaveBeenCalledTimes(1);
  
              expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: {
                    username: newUser.username,
                    password: hashedPassword
                }
            });

        })
    })

   describe('auth/login',()=>{
       it("successfully login the user with valid username and password",async () => {
             const user = {
                username : "Auth test",
                password : "authpassword"
             }
             const hashedPassword = "AuthHashPassword";
             const token = "abcdefg"
             prismaMock.user.findUnique.mockResolvedValue(user);
             bcrypt.compare.mockResolvedValue(hashedPassword);
             jwt.sign.mockReturnValue(token);

             const response = await request(app).post('/auth/login').send(user);
           

             expect(response.status).toBe(200);
             expect(response.body.token).toEqual(token);
             expect(bcrypt.compare).toHaveBeenCalledTimes(1);
       })
   })

   describe('GET /auth/me',()=>{
    it("returns login user profile",async ()=>{
        const user ={
            id:1,
            username : "Auth test",
            password:"AuthPassword"

        }
        jwt.verify.mockReturnValue({ id: user.id });
        prismaMock.user.findUnique.mockResolvedValue(user);

        const response = await request(app).get('/auth/me').set('Authorization','Bearer abcdefg');
        expect(response.status).toBe(200);
        expect(response.body.user.id).toEqual(user.id);
        expect(response.body.user.username).toEqual(user.username);
        expect(response.body.user.password).toBeUndefined();
    })
   })





})