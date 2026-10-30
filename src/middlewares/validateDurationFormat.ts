import { NextFunction, Request, Response } from "express";
import { ApiError } from "../apiError";

export const validateDurationFormat = (req: Request, _res: Response, next: NextFunction): void => {
  if (typeof req.body.duration !== "string" || !/^\d{2}:[0-5]\d$/.test(req.body.duration)) {
    return next(new ApiError(400, "El campo duration debe tener formato mm:ss y segundos entre 00 y 59"));
  }

  next();
};
