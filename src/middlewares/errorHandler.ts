import { NextFunction, Request, Response } from "express";
import { ApiError } from "../apiError";

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof SyntaxError) {
    const parseError = error as SyntaxError & { status?: number; type?: string };
    if (parseError.status === 400 && parseError.type === "entity.parse.failed") {
      res.status(400).json({ error: "JSON malformado" });
      return;
    }
  }

  console.error(error);
  res.status(500).json({ error: "Error interno del servidor" });
};
