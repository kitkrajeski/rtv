const express = require("express");
const authRouter = express.Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

authRouter.get("/", (req, res, next) => {
  res.status(200).send("howdy");
});

authRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "That username is already taken." });
      }

      const newUser = new User({ username, password });

      newUser
        .save()
        .then((savedUser) => {
          const token = jwt.sign(
            savedUser.toJSON().withoutPassword(),
            process.env.SECRET
          );
          return res
            .status(201)
            .json({ token, user: savedUser.withoutPassword() });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username.toLowerCase(),
    });

    if (!user) {
      res.status(403);
      return next(new Error("Username or Password are incorrect"));
    }

    // if (req.body.password !== user.password) {
    //   res.status(403);
    //   return next(new Error("Username or Password are incorrect"));
    // }

    const passwordCheck = await user.checkPassword(req.body.password);
    if (!passwordCheck) {
      res.status(403);
      return next(new Error("incorrect username or password"));
    }

    const token = jwt.sign(
      // user.toObject().withoutPassword(),
      user.withoutPassword(),
      process.env.SECRET
    );
    return res.status(200).send({ token, user: user.withoutPassword() });
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

module.exports = authRouter;
