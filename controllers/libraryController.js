import User from '../models/User.js';
import Game from '../models/Game.js';

export const getLibrary = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('biblioteca');

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.json({ games: user.biblioteca });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener la biblioteca del usuario' });
    }
};

export const addGameToLibrary = async (req, res) => {
    const { gameId } = req.params;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' }),
            console.log("Usuario no encontrado");
        }

        const alreadyInLibrary = user.biblioteca.some(
            id => id.toString() === gameId
        );

        if (alreadyInLibrary) {
            return res.status(400).json({ message: 'El juego ya está en la biblioteca' }),
            console.log("El juego ya está en la biblioteca");
        }

        user.biblioteca.push(gameId);
        await user.save();

        return res.json({ message: 'Juego añadido a la biblioteca correctamente' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al añadir el juego a la biblioteca' });
    }
};

export const removeGameFromLibrary = async (req, res) => {
    const { gameId } = req.params;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const initialLength = user.biblioteca.length;

        user.biblioteca = user.biblioteca.filter(
            id => id.toString() !== gameId
        );

        if (user.biblioteca.length === initialLength) {
            return res.status(404).json({ message: 'El juego no estaba en la biblioteca' });
        }

        await user.save();

        return res.json({ message: 'Juego eliminado de la biblioteca correctamente' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar el juego de la biblioteca' });
    }
};
