import express from "express";
import ReviewsModel from "./model.js";

const reviewsRouter = express.Router();

//this is for adding a new review
reviewsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ReviewsModel.create(req.body);
    res.status(201).send({ reviewId: id });
  } catch (error) {
    next(error);
  }
});

//this is for fetching all the reviews
reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewsModel.findAll();
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

//this is for posting more reviews at once
reviewsRouter.post("/bulk", async (req, res, next) => {
  try {
    const reviews = await ReviewsModel.bulkCreate([
      { content: "a product" },
      { content: "a second product" },
      { content: "a third product" },
      { content: "a fourth product" },
    ]);
    res.send(reviews.map((review) => review.id));
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
