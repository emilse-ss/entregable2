import { Router } from "express";
import { actualizar, crear, eliminar, listar } from "../controllers/songs.controller";

const router = Router();

router.get("/", listar);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

export default router;
