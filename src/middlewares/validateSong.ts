import { NextFunction, Request, Response } from "express";
import { ApiError } from "../apiError";

export const validateSong = (req: Request, _res: Response, next: NextFunction): void => {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return next(new ApiError(400, "El cuerpo debe contener una canción válida"));
  }
  if (Object.prototype.hasOwnProperty.call(body, "id")) {
    return next(new ApiError(400, "El campo id no puede enviarse"));
  }
  if (typeof body.title !== "string" || body.title.trim() === "") {
    return next(new ApiError(400, "El campo title debe ser un string no vacío"));
  }
  if (typeof body.album !== "string" || body.album.trim() === "") {
    return next(new ApiError(400, "El campo album debe ser un string no vacío"));
  }
  if (!Number.isInteger(body.releaseYear)) {
    return next(new ApiError(400, "El campo releaseYear debe ser un entero"));
  }
  if (typeof body.duration !== "string") {
    return next(new ApiError(400, "El campo duration debe ser un string"));
  }
  if (typeof body.isTitleTrack !== "boolean") {
    return next(new ApiError(400, "El campo isTitleTrack debe ser booleano"));
  }
  if (typeof body.mood !== "string" || body.mood.trim() === "") {
    return next(new ApiError(400, "El campo mood debe ser un string no vacío"));
  }

  next();
};
