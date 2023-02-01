import { ValidationError } from "sequelize";

export const badRequestErrorHandler = async (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ success: false, message: err.message });
  } else if (err instanceof ValidationError) {
    res
      .status(400)
      .send({ success: false, message: err.errors.map((e) => e.message) });
  } else {
    next(err);
  }
};

export const notFoundErrorHandler = async (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ success: false, message: err.message });
  } else {
    next(err);
  }
};

export const genericErrorHandler = async (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ success: false, message: "Generic Server Error" });
};
