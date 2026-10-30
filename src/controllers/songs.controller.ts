import { NextFunction, Request, Response } from "express";
import { ApiError } from "../apiError";
import { NewSong } from "../tipos";
import {
  actualizarSong,
  buscarSongsPorNombre,
  crearSong,
  eliminarSong,
  filtrarSongsPorAlbum,
  listarSongs
} from "../services/songs.service";

export const listar = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.status(200).json(listarSongs());
  } catch (error) {
    next(error);
  }
};

export const buscarPorNombre = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const name = typeof req.query.name === "string" ? req.query.name : undefined;
    if (!name) {
      throw new ApiError(400, "El parámetro name es obligatorio");
    }
    res.status(200).json(buscarSongsPorNombre(name));
  } catch (error) {
    next(error);
  }
};

export const filtrarPorAlbum = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const albumName = req.params.albumName as string;
    res.status(200).json(filtrarSongsPorAlbum(albumName));
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
    res.status(200).json(actualizarSong(req.params.id as string, req.body as NewSong));
  } catch (error) {
    next(error);
  }
};

export const eliminar = (req: Request, res: Response, next: NextFunction): void => {
  try {
    eliminarSong(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
