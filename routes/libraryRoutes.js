import express from "express";
import { validarToken } from "../middleware/validarUser.js";
import {
  getLibrary,
  addGameToLibrary,
  removeGameFromLibrary
} from "../controllers/libraryController.js";

const router = express.Router();

router.get("/", validarToken, getLibrary);
router.post("/:gameId", validarToken, addGameToLibrary);
router.delete("/:gameId", validarToken, removeGameFromLibrary);

export default router;
