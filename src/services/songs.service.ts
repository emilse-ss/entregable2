import { randomUUID } from "crypto";
import { ApiError } from "../apiError";
import { songs } from "../data/songs";
import { NewSong, Song } from "../tipos";

export const listarSongs = (): Song[] => songs;

export const buscarSongsPorNombre = (nombre: string): Song[] => {
  const resultados = songs.filter((song) =>
    song.title.toLowerCase().includes(nombre.toLowerCase())
  );
  if (resultados.length === 0) {
    throw new ApiError(404, `No se encontraron canciones con el nombre ${nombre}`);
  }
  return resultados;
};

export const filtrarSongsPorAlbum = (albumName: string): Song[] => {
  const resultados = songs.filter((song) =>
    song.album.toLowerCase() === albumName.toLowerCase()
  );
  if (resultados.length === 0) {
    throw new ApiError(404, `No se encontraron canciones del álbum ${albumName}`);
  }
  return resultados;
};

export const crearSong = (nuevaSong: NewSong): Song => {
  const song: Song = { id: randomUUID(), ...nuevaSong };
  songs.push(song);
  return song;
};

export const actualizarSong = (id: string, datos: NewSong): Song => {
  const indice = songs.findIndex((song) => song.id === id);
  if (indice === -1) {
    throw new ApiError(404, `No existe una canción con id ${id}`);
  }

  const songActualizada: Song = { id, ...datos };
  songs[indice] = songActualizada;
  return songActualizada;
};

export const eliminarSong = (id: string): void => {
  const indice = songs.findIndex((song) => song.id === id);
  if (indice === -1) {
    throw new ApiError(404, `No existe una canción con id ${id}`);
  }

  songs.splice(indice, 1);
};
