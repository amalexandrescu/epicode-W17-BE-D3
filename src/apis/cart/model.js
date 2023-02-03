import sequelize from "../../db.js";
import { DataTypes } from "sequelize";
import UsersModel from "../users/model.js";
import ProductsModel from "../products/model.js";

const CartModel = sequelize.define("cart", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

UsersModel.hasMany(CartModel, { onDelete: "CASCADE" });
CartModel.belongsTo(UsersModel, { onDelete: "CASCADE" });

ProductsModel.hasMany(CartModel, { onDelete: "CASCADE" });
CartModel.belongsTo(ProductsModel, { onDelete: "CASCADE" });

export default CartModel;
