const express = require("express");
const Idea = require("../models/Ideas.model");
const { getAccessToken } = require("../utils");

var ideaRouter = express.Router();

const createTimeLineEvent = async (idea) => {
  const accessToken = await getAccessToken(1);
  try {
    await axios.post(`http://localhost:8081/api/timeline/${accessToken}`, {
      idea,
    });
  } catch (err) {
    console.log(err);
  }
};

ideaRouter.get("/", async (req, res, next) => {
  try {
    const allIdeas = await Idea.find({}).populate("author").exec();

    res.send(allIdeas);
  } catch (err) {
    next(err);
  }
});

ideaRouter.post("/", async (req, res, next) => {
  const idea = req.body;
  console.log(idea);
  try {
    const dbResponse = await Idea.create(idea);
    const populatedIdea = await dbResponse.populate("author").execPopulate();
    res.send(populatedIdea);
    createTimeLineEvent(populatedIdea);
  } catch (err) {
    next(err);
  }
});

ideaRouter.delete("/", async (req, res, next) => {
  try {
    await Idea.deleteMany({});
    res.send("All Ideas deleted");
  } catch (err) {
    next(err);
  }
});

module.exports = ideaRouter;
