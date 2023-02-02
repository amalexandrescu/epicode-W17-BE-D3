import express from "express";
import createHttpError from "http-errors";
import ProductsModel from "./model.js";
import { Op } from "sequelize";
import ReviewsModel from "../reviews/model.js";
import ProductsCategoriesModel from "./productsCategoriesModel.js";
import CategoriesModel from "../categories/model.js";

const productsRouter = express.Router();

//this is for adding a new product
//related to many-to-many relation
productsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductsModel.create(req.body);
    if (req.body.categories) {
      await ProductsCategoriesModel.bulkCreate(
        req.body.categories.map((category) => {
          return {
            categoryId: category,
            productId: id,
          };
        })
      ); // --> [{categoryId: "asdasd", blogId: "asdasdasdas"}]
    }
    res.status(201).send({ productdId: id });
  } catch (error) {
    next(error);
  }
});

//this endpoint is for fetching all products
//is related to the many-to-many relation
//the commented code is from previous days when we had a min price and a max price in the queries
productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    // if (req.query.price.min) {
    //   query.price = {
    //     ...query.price,
    //     [Op.gte]: [req.query.price.min],
    //     // [Op.gte]: [req.query.price["min"]],
    //   };
    // }
    // if (req.query.price.max) {
    //   query.price = {
    //     ...query.price,
    //     [Op.lte]: [req.query.price.max],
    //   };
    // }
    // if (req.query.price) {
    //   query.price = {
    //     [Op.between]: [req.query.price.min, req.query.price.max],
    //   };
    //   // query = http://localhost:3001/product?price[min]=100&price[max]=200
    // }
    // if (req.query.priceMin && req.query.priceMax) {
    //   query.price = {
    //     [Op.and]: {
    //       [Op.gte]: req.query.priceMin,
    //       [Op.lte]: req.query.priceMax,
    //     },

    //   };
    // http://localhost:3001/product?priceMin=10&priceMax=15&description=white&name=oy
    // }
    if (req.query.description) {
      query.description = { [Op.iLike]: `%${req.query.description}%` };
    }

    if (req.query.name) {
      query.name = { [Op.iLike]: `%${req.query.name}` };
    }
    console.log("query: ", query);

    // const products = await ProductsModel.findAll({
    //   // where: { ...query },
    //   // where: { price: { [Op.gte]: 15 } },
    //   attributes: ["id", "name", "price", "description"],
    // });

    const products = await ProductsModel.findAll({
      include: [
        {
          model: CategoriesModel,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });

    res.send(products);
  } catch (error) {
    next(error);
  }
});

//this endpoint is for fetching a single product
//it will also show the categories for a certain product (include part)
//related to the many-to-many relation
productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId, {
      include: [
        {
          model: CategoriesModel,
          attributes: ["name", "categoryId"],
          through: { attributes: [] },
        },
      ],
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

//this endpoint is for editing a single product
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

//this endpoint is for deleting a dingle product
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

// this endpoint is for fetching all reviews from a certain product
//is related to the 1-to-many relation
productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId, {
      include: {
        model: ReviewsModel,
        attributes: ["content"],
      },
    });
    res.send(product);
  } catch (error) {
    next(error);
  }
});

//this endpoint is for adding a category in a product (for the many-to-many relation)
//categoryId: in the body
//productId: in the req.params
productsRouter.put("/:productId/category", async (req, res, next) => {
  try {
    const { id } = await ProductsCategoriesModel.create({
      productId: req.params.productId,
      categoryId: req.body.categoryId,
    });
    res.status(201).send({ id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default productsRouter;
