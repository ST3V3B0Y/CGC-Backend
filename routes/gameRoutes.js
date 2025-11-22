import express from 'express';
import { getGames, getGameById, createGame, updateGame, deleteGame } from '../controllers/gameController.js';
import { validarToken } from '../middleware/validarUser.js';
import { validarAdmin } from '../middleware/validarAdmin.js';

const router = express.Router();

// Ruta para obtener todos los juegos
router.get('/', getGames);

// Agregar juego en la biblioteca del usuario
router.post("/library/add", validarToken, /*addGameToUserLibrary*/);

// Eliminar juego de la biblioteca del usuario
router.delete("/library/remove/:id", validarToken, /*removeGameFromUserLibrary*/);

// Ruta para obtener un juego por ID
router.get('/:id', getGameById);

// Ruta para crear un nuevo juego
router.post('/', validarAdmin ,createGame);

// Ruta para actualizar un juego existente
router.put('/:id', updateGame);

// Ruta para eliminar un juego
router.delete('/:id',  validarAdmin, deleteGame);

export default router;