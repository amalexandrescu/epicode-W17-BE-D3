import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import ProductsModel from "../products/model.js";
import UsersModel from "../users/model.js";

const ReviewsModel = sequelize.define("review", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// 1 to many relationship (1 product -> many reviews)

ProductsModel.hasMany(ReviewsModel, { onDelete: "CASCADE" });
// ProductsModel.hasMany(ReviewsModel);
ReviewsModel.belongsTo(ProductsModel, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

// 1 to many relationship (1 user -> many reviews)

UsersModel.hasMany(ReviewsModel, { onDelete: "CASCADE" });
ReviewsModel.belongsTo(UsersModel, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

export default ReviewsModel;
