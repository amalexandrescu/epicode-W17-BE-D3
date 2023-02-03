import express from "express";
import ProductsModel from "../products/model.js";
import CartModel from "./model.js";
import sequelize from "sequelize";

const cartRouter = express.Router();

cartRouter.post("/:productId/:userId", async (req, res, next) => {
  try {
    const { productId, userId } = req.params;
    const data = await CartModel.create({ productId, userId });
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

cartRouter.get("/:userId", async (req, res, next) => {
  try {
    const data = await CartModel.findAll({
      include: [{ model: ProductsModel }],
      attributes: [
        "productId",
        [sequelize.fn("count", sequelize.col("cart.id")), "unitQty"],
        [sequelize.fn("sum", sequelize.col("product.price")), "unitTotalPrice"],
      ],
      group: ["productId", "product.id"],
      where: {
        userId: req.params.userId,
      },
    });

    const totalQty = await CartModel.count({
      where: {
        userId: req.params.userId,
      },
    });

    const totalSum = await CartModel.sum("product.price", {
      include: {
        model: ProductsModel,
        attributes: [],
      },
    });

    res.send({ data, totalQty, totalSum });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

cartRouter.delete("/:productId/:userId", async (req, res, next) => {
  try {
    const { productId, userId } = req.params;

    const numberOfDeletedRows = await CartModel.destroy({
      where: {
        productId,
        userId,
      },
    });
    //because maybe there is more than one product we want to delete
    if (numberOfDeletedRows !== 0) {
      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default cartRouter;
