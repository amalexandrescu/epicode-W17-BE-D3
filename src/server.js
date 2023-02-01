import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./apis/products/index.js";
import { pgConnect, syncModels } from "./db.js";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  genericErrorHandler,
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT || 3001;

//MIDDLEWARES

server.use(cors());
server.use(express.json());

//ENDPOINTS
server.use("/product", productsRouter);

//ERROR HANDLERS

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);

await pgConnect();
await syncModels();

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.table(listEndpoints(server));
});
