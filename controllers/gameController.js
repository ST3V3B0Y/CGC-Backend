import Game from '../models/Game.js';

// Controladores para manejar las operaciones relacionadas con los juegos

// Obtener todos los juegos
const getGames = async (req, res) => {
    try {
        const games = await Game.find();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los juegos", error });
    }
};

// Obtener un juego por ID 
const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).jason({ message: "Juego no encontrado" });
        res.status(200).json(game);
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({ 
            message: "Error al buscar el juego", 
            error: error.message,
            details: error
        });
    }
};

// Crear un nuevo juego
const createGame = async (req, res) => {
    try {
        const newGame = new Game(req.body);
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({ 
            message: "Error al crear el juego", 
            error: error.message,
            details: error
        });
    }
};

// Actualizar un juego existente
const updateGame = async (req, res) => {
    try {
        const updateGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateGame) return res.status(404).json({ message: "Juego no encontrado" });
        res.status(200).json(updateGame);
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({ 
            message: "Error al actualizar el juego", 
            error: error.message,
            details: error
        });
    }
}

// Eliminar un juego
const deleteGame = async (req, res) => {
    try {
        const deletedGame = await Game.findByIdAndDelete(req.params.id);
        if (!deletedGame) return res.status(404).json({ message: "Juego no encontrado" });
        res.status(200).json({ message: "Juego eliminado correctamente" });
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({ 
            message: "Error al eliminar el juego", 
            error: error.message,
            details: error
        });
    }
};

export { getGames, getGameById, createGame, updateGame, deleteGame };