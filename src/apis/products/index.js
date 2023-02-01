import express from "express";
import createHttpError from "http-errors";
import ProductsModel from "./model.js";
import { Op } from "sequelize";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductsModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.priceMin && req.query.priceMax) {
      query.price = {
        [Op.and]: {
          [Op.gte]: req.query.priceMin,
          [Op.lte]: req.query.priceMax,
        },
      };
    }
    if (req.query.description) {
      query.description = { [Op.iLike]: `%${req.query.description}%` };
    }

    if (req.query.name) {
      query.name = { [Op.iLike]: `%${req.query.name}` };
    }
    console.log("query: ", query);

    const products = await ProductsModel.findAll({
      where: { ...query },
      // where: { price: { [Op.gte]: 15 } },
      attributes: ["id", "name", "category", "price", "description"],
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(
      req.body,
      {
        where: { id: req.params.productId },
        returning: true,
      }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductsModel.destroy({
      where: { id: req.params.productId },
    });

    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
