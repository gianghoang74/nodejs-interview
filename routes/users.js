var express = require("express");
var router = express.Router();
var { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { isEmpty } = require("lodash");

// get config vars
dotenv.config();

/* GET users by id. */
router.get("/:id", authenticateToken, async function (req, res) {
  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    select: {
      games: true,
      id: true,
      name: true,
      email: true,
    },
  });
  res.send(user);
});

/* POST signup */
router.post("/signup", async function (req, res) {
  try {
    await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: hashPassword(req.body.password),
      },
    });
    res.send("create new user sucessful");
  } catch (error) {
    res.status(400).send(error);
  }
});

/* POST login */
router.post("/login", async function (req, res) {
  const user = await prisma.user.findFirst({
    where: {
      email: req.body.email,
    },
  });
  console.log(req.body.password, user.password);
  console.log(bcrypt.compareSync(req.body.password, user.password));
  if (isEmpty(user) || !bcrypt.compareSync(req.body.password, user.password)) {
    res.status(400).send("invalid email or password");
  }
  const jwtToken = generateAccessToken(user.id, user.name);

  res.send({ token: jwtToken });
});

/* PATCH update user */
router.patch("/:id", authenticateToken, async function (req, res) {
  await prisma.user.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: {
      name: req.body.name,
    },
  });
  res.send("update use successful");
});

/* DELETE delete user */
router.delete("/:id", async function (req, res) {
  await prisma.user.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.send("delete use successful");
});

function generateAccessToken(id, name) {
  return jwt.sign({ id, name }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.EXPIRE_TIME,
  });
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

module.exports = router;
