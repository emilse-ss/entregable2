import { Router } from "express";
import { validateSong } from "../middlewares/validateSong";
import { validateDurationFormat } from "../middlewares/validateDurationFormat";
import {
  actualizar,
  buscarPorNombre,
  crear,
  eliminar,
  filtrarPorAlbum,
  listar
} from "../controllers/songs.controller";

const router = Router();

router.get("/search", buscarPorNombre);
router.get("/album/:albumName", filtrarPorAlbum);
router.get("/", listar);
router.post("/", validateSong, validateDurationFormat, crear);
router.put("/:id", validateSong, validateDurationFormat, actualizar);
router.delete("/:id", eliminar);

export default router;
