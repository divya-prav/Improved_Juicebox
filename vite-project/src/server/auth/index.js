const router = require("express").Router();

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /auth/me
router.get("/me", async (req, res, next) => {
  try {
    
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    console.log("req----"+JSON.stringify(req.user));
    delete user.password;
    res.send(user);
  } catch (e) {
    next(e);
  }
});

//POST auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT);
    res.status(201).send({ token });
  } catch (e) {
    next(e);
  }
});

//POST auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password",
      });
    }
  
    const existUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!existUser) {
      return res.status(401).send("Invalid login credentials.");
    }

    const passwordMatch = await bcrypt.compare(password, existUser.password);

    if (passwordMatch) {
      const token = jwt.sign({ id: existUser.id }, process.env.JWT);
      res.send({ token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
