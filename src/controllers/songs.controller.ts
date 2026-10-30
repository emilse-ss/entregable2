import { NextFunction, Request, Response } from "express";
import { ApiError } from "../apiError";
import { NewSong } from "../tipos";
import { actualizarSong, crearSong, eliminarSong, listarSongs } from "../services/songs.service";

export const listar = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.status(200).json(listarSongs());
  } catch (error) {
    next(error);
  }
};

export const crear = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.status(201).json(crearSong(req.body as NewSong));
  } catch (error) {
    next(error);
  }
};

export const actualizar = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.status(200).json(actualizarSong(req.params.id, req.body as NewSong));
  } catch (error) {
    next(error);
  }
};

export const eliminar = (req: Request, res: Response, next: NextFunction): void => {
  try {
    eliminarSong(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
