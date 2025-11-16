import express from 'express';
import { getGames, getGameById, createGame, updateGame, deleteGame } from '../controllers/gameController.js';

const router = express.Router();

// Ruta para obtener todos los juegos
router.get('/', getGames);

// Ruta para obtener un juego por ID
router.get('/:id', getGameById);

// Ruta para crear un nuevo juego
router.post('/', createGame);

// Ruta para actualizar un juego existente
router.put('/:id', updateGame);

// Ruta para eliminar un juego
router.delete('/:id', deleteGame);

export default router;