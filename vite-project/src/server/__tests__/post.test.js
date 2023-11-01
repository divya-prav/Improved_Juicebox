const app = require("../app");

const request = require("supertest");

const prismaMock = require("../mocks/prismaMock");
describe(" /api/posts", () => {

  describe("GET /api/post", () => {
    console.log(prismaMock);
    it("returns all the posts", async () => {
      const posts = [
        { id: 1, title: "Test", content: "Test Test", userId: 1 },

        { id: 2, title: "Test2", content: "Test Test2", userId: 2 },
      ];

      prismaMock.post.findMany.mockResolvedValue(posts);
      

      const response = await request(app).get("/api/posts");
     
       expect(response.body.posts[0]).toEqual(posts[0]);
       expect(response.body.posts[1]).toEqual(posts[1]);
    });
  });
});
