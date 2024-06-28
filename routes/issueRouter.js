const express = require("express");
const issueRouter = express.Router();
const Issue = require("../models/issue.js");
const jwt = require("jsonwebtoken");
const issue = require("../models/issue.js");

// issueRouter.get("/", async (req, res, next) => {
//   Issue.find()
//     .populate("user", "username")
//     .exec((err, issues) => {
//       if (err) return res.status(500).send(err);
//       return res.status(200).send(issues);
//     });
// });

issueRouter.get("/", async (req, res, next) => {
  try {
    const issues = await Issue.find().populate("user", "username").exec();
    res.status(200).send(issues);
  } catch (err) {
    res.status(500).send(err);
  }
});

issueRouter.post("/", async (req, res, next) => {
  try {
    const newIssue = new Issue({ ...req.body, user: req.auth._id });
    const savedIssue = await newIssue.save();
    res.status(201).send(savedIssue);
  } catch (err) {
    res.status(500).send(err);
  }
});

issueRouter.put("/:id/upvote", async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    return res.status(404).send("Issue not found");
  }
  if (!issue.upvotes.includes(req.auth._id)) {
    issue.upvotes.push(req.auth._id);
    issue.downvotes = issue.downvotes.filter(
      (userId) => userId.toString() != req.auth._id
    );
  } else {
    issue.upvotes = issue.upvotes.filter(
      (userId) => userId.toString() !== req.auth._id
    );
  }

  const updatedIssue = await issue.save();
  res.status(200).send(updatedIssue);
});

module.exports = issueRouter;
