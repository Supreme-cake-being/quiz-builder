import { RequestHandler } from "express";
import { HttpError } from "helpers";

export const isEmptyBody: RequestHandler = (req, _, next) => {
  if (!Object.keys(req.body).length) {
    return next(HttpError(400, "Missing fields"));
  }
  next();
};
