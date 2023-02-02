import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import UsersModel from "./model.js";
import ReviewsModel from "../reviews/model.js";

const usersRouter = express.Router();

//add new user
usersRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await UsersModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

//get all the users
usersRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.firstName)
      query.firstName = { [Op.iLike]: `${req.query.firstName}%` };
    const users = await UsersModel.findAll({
      where: { ...query },
      attributes: ["firstName", "lastName"],
    }); // (SELECT) pass an array for the include list
    res.send(users);
  } catch (error) {
    next(error);
  }
});

//get single user by id
usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      attributes: { exclude: ["createdAt", "updatedAt"] }, // (SELECT) pass an object with exclude property for the omit list
    });
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//edit single user
usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await UsersModel.update(
      req.body,
      {
        where: { id: req.params.userId },
        returning: true,
      }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//delete single user
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await UsersModel.destroy({
      where: { id: req.params.userId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//get all the users with the reviews
//it is related to the 1-to-many relation between user(1)-reviews(more)
//for the 1-to-many relation see the include part from the endpoint
usersRouter.get("/:userId/reviews", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      include: {
        model: ReviewsModel,
        attributes: ["content"],
      },
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
