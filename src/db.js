import { Sequelize } from "sequelize";

const { PG_DB, PG_USER, PG_PASSWORD, PG_HOST, PG_PORT } = process.env;

const options = {
  host: PG_HOST,
  port: PG_PORT,
  dialect: "postgres",
};

const sequelize = new Sequelize(PG_DB, PG_USER, PG_PASSWORD, options);

export const pgConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to Postgres!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const syncModels = async () => {
  await sequelize.sync({ alter: true });
  console.log("All tables successfully synchronized!");
};

export default sequelize;
