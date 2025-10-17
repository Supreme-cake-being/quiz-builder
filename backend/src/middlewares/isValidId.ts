import { RequestHandler } from "express";
import { HttpError } from "helpers";

export const isValidId = (key: string): RequestHandler => {
  return (req, _, next) => {
    const id = req.params[key];

    // Check for undefined, null, or empty string
    if (id === undefined || id === null || id.trim() === "") {
      return next(HttpError(400, `Missing or invalid ${key}`));
    }

    // Check if numeric
    const num = Number(id);
    if (isNaN(num) || num <= 0) {
      return next(HttpError(400, `Invalid ${key}: must be a positive number`));
    }

    next();
  };
};
