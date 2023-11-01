const router = require("express").Router();

const prisma = require('../client');

//middleware to check if user logged in or not
// router.use((req, res, next) => {
//   if (!req.user) {
//     return res.status(401).send("You must be logged in to do that.");
//   }
//   next();
// });

// Get all post /api/post
router.get("/posts", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();
    res.send({posts});
  } catch (e) {
    next(e);
  }
});

//POST api/post
router.post("/post", async (req, res, next) => {
  try {
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        userId: req.user.id,
      },
    });
    res.status(201).send(`Post created ${post}`);
  } catch (e) {
    next(e);
  }
});

//GET by postId api/post/:postId
router.get("/post/:postId", async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.postId,
      },
    });

    if (post) {
      res.status(200).send(post);
    } else {
      next({
        name: "error",
        message: "Post not found",
      });
    }
  } catch (e) {
    next(e);
  }
});

//PUT api/post/:postId
router.put("/post/:postId", async (req, res, next) => {
  try {
    const post = await prisma.post.update({
      where: {
        id: Number(req.params.postId),
        userId: req.user.id,
      },
      data: {
        title: req.body.title,
        content: req.body.content,
      },
    });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.send(post);
  } catch (e) {
    next(error);
  }
});

// Delete a post by id
// api/post/:postId
router.delete("post/:postId", async (req, res, next) => {
  try {
    const post = await prisma.post.delete({
      where: {
        id: Number(req.params.postId),
        userId: req.user.id,
      },
    });

    if (!post) {
      return res.status(404).send("Post not found.");
    }

    res.send(post);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
