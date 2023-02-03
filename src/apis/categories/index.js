import express from "express";
import CategoriesModel from "./model.js";

const categoriesRouter = express.Router();

//create a new category in categories table
categoriesRouter.post("/", async (req, res, next) => {
  try {
    const { categoryId } = await CategoriesModel.create(req.body);
    res.status(201).send({ categoryId: categoryId });
  } catch (error) {
    next(error);
  }
});

//fetch all categories
categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.findAll();
    res.send(categories);
  } catch (error) {
    next(error);
  }
});

//post more categories at once
categoriesRouter.post("/bulk", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.bulkCreate([
      { name: "second category" },
      { name: "third category" },
      { name: "fourth category" },
      { name: "fifth category" },
    ]);
    res.send(categories.map((c) => c.categoryId));
  } catch (error) {
    next(error);
  }
});

//get single category by id
categoriesRouter.get("/:categoryId", async (req, res, next) => {
  try {
    const category = await CategoriesModel.findByPk(req.params.categoryId, {
      attributes: { exclude: ["createdAt", "updatedAt"] }, // (SELECT) pass an object with exclude property for the omit list
    });
    if (category) {
      res.send(category);
    } else {
      next(
        createHttpError(
          404,
          `Category with id ${req.params.categoryId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//edit single category
categoriesRouter.put("/:categoryId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await CategoriesModel.update(
      req.body,
      {
        where: { categoryId: req.params.categoryId },
        returning: true,
      }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `Category with id ${req.params.categoryId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//delete a single category by id
categoriesRouter.delete("/:categoryId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await CategoriesModel.destroy({
      where: { categoryId: req.params.categoryId },
    });

    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Category with id ${req.params.categoryId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
export default categoriesRouter;
