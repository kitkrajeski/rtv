const express = require("express");
const commentRouter = express.Router();
const Comment = require("../models/comment.js");
const jwt = require("jsonwebtoken");

commentRouter.post("/", async (req, res, next) => {
  try {
    const newComment = new Comment({ ...req.body, user: req.auth._id });
    const savedComment = await newComment.save();
    res.status(201).send(savedComment);
  } catch (err) {
    res.status(500).send(err);
  }
});

commentRouter.get("/", async (req, res) => {
  const comments = await Comment.find().populate("user", "username").exec();
  res.status(200).send(comments);
});

commentRouter.get("/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id)
    .populate("user", "username")
    .exec();
  res.status(200).send(comment);
});

commentRouter.get("/owned-by-user", async (req, res) => {
  const comments = await Comment.find({ user: req.auth._id })
    .populate("user", "username")
    .exec();
  res.status(200).send(comments);
});

module.exports = commentRouter;
