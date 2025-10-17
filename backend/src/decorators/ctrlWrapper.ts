import { NextFunction, Request, RequestHandler, Response } from "express";

export const ctrlWrapper = (ctrl: RequestHandler) => {
  const func = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return func;
};
