import express from "express";
import CategoriesModel from "./model.js";

const categoriesRouter = express.Router();

//create a new category
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

//delete a single category by id
categoriesRouter.delete("/:categoryId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductsModel.destroy({
      where: { id: req.params.categoryId },
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
