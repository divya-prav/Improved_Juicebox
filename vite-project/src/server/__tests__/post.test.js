const app = require("../app");
const request = require("supertest");
const prismaMock = require("../mocks/prismaMock");
const jwt = require("jsonwebtoken");
const { beforeEach } = require("@jest/globals");

jest.mock("jsonwebtoken");


describe(" /api/posts", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const user = {
    id: 1,
  };

  describe("GET /api/post", () => {
    it("returns all the posts", async () => {
      const posts = [
        { id: 1, title: "Test", content: "Test Test", userId: 1 },

        { id: 2, title: "Test2", content: "Test Test2", userId: 2 },
      ];

      jwt.verify.mockReturnValue({ id: user.id });
      prismaMock.post.findMany.mockResolvedValue(posts);

      const response = await request(app)
        .get("/api/posts")
        .set("Authorization", "Bearer fakeToken");
      expect(response.status).toBe(200);
      expect(response.body.posts[0]).toEqual(posts[0]);
      expect(response.body.posts[1]).toEqual(posts[1]);
    });
  });

  describe("GET /api/post/:id", () => {
    it("returns post by id", async () => {
      const post = [{ id: 1, title: "Test", content: "Test Test", userId: 1 }];

      jwt.verify.mockReturnValue({ id: user.id });
      prismaMock.post.findUnique.mockResolvedValue(post);

      const response = await request(app)
        .get("/api/post/1")
        .set("Authorization", "Bearer fakeToken");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(post);
    });
  });

  describe("POST /api/post", () => {
    it("should create a new post for valid user", async () => {
      const newPost = {
        id: 1,
        title: "TEST",
        content: "test test",
        userId: user.id,
      };
      jwt.verify.mockReturnValue({ id: user.id });
      prismaMock.post.create.mockResolvedValue(newPost);

      const response = await request(app)
        .post("/api/post")
        .set("Authorization", "Bearer fakeToken");
      const { post } = response.body;

      expect(response.status).toBe(201);
      expect(post.id).toEqual(newPost.id);
      expect(post.title).toEqual(newPost.title);
      expect(post.content).toEqual(newPost.content);
      expect(post.userId).toEqual(newPost.userId);
      expect(prismaMock.post.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("PUT /api/post/:postId", () => {
    it("should update post for valid user", async () => {
      const postToUpdate = {
        id: 1,
        title: "TEST",
        content: "test test",
        userId: user.id,
      };

      const updatedPost = {
        id: 1,
        title: "PUT TEST",
        content: "Updating test case",
        userId: user.id,
      };
      jwt.verify.mockReturnValue({ id: user.id });
      prismaMock.post.findUnique.mockResolvedValue(postToUpdate);
      prismaMock.post.update.mockResolvedValue(updatedPost);

      const response = await request(app)
        .put("/api/post/1")
        .set("Authorization", "Bearer fakeToken")
        .send(updatedPost);
      const { post } = response.body;

      expect(response.status).toBe(200);
      expect(post.id).toEqual(updatedPost.id);
      expect(post.title).toEqual(updatedPost.title);
      expect(post.content).toEqual(updatedPost.content);
      expect(post.userId).toEqual(updatedPost.userId);
      expect(prismaMock.post.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("DELETE /api/post/:postId", () => {
    it("should delete a post for valid user", async () => {
      const postToDelete = {
        id: 1,
        title: "TEST",
        content: "test test",
        userId: user.id,
      };
      jwt.verify.mockReturnValue({ id: user.id });
      prismaMock.post.create.mockResolvedValue(postToDelete);

      const responseCreate = await request(app)
        .post("/api/post")
        .set("Authorization", "Bearer fakeToken");
      console.log(responseCreate.body);
      prismaMock.post.delete.mockResolvedValue(postToDelete);
      const response = await request(app)
        .delete("/api/post/1")
        .set("Authorization", "Bearer fakeToken");
      const { post } = response.body;
      console.log(post);
      expect(response.status).toBe(200);
      expect(post.id).toEqual(postToDelete.id);
      expect(post.title).toEqual(postToDelete.title);
      expect(post.content).toEqual(postToDelete.content);
      expect(post.userId).toEqual(postToDelete.userId);
      expect(prismaMock.post.create).toHaveBeenCalledTimes(1);
    });
  });
});
