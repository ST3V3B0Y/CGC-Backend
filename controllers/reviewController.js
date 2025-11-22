import Review from '../models/Review.js';

// Controladores para manejar las operaciones relacionadas con las reseñas

// Obtener todas las reseñas
const getReview = async (req, res) => {
    try {
        const review = await Review.find().populate('juegoId', "titulo genero plataforma");
        res.status(200).json(review);
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            message: "Error al obtener las reseñas",
            error: error.message,
            details: error
        });
    }
};

// Obtener una reseña por ID
const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('juegoId', "titulo");
        if (!review) return res.status(404).json({ message: "Reseña no encontrada" });
        res.status(200).json(review);
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            message: "Error al buscar la reseña por ID",
            error: error.message,
            details: error
        });
    }
};

// Obtener una reseña por un juego específico
const getReviewByGameId = async (req, res) => {
    try {
        const { juegoId } = req.params;
        const review = await Review.find({ juegoId })
            .populate('juegoId', "titulo genero plataforma")
            .populate('juegoId', 'titulo genero plataforma');
        if (!review || review.length === 0) {
            return res.status(404).json({ message: "No se encontraron reseñas para este juego" });
        }
        res.status(200).json(review);
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            message: "Error al buscar la reseña por el ID del juego",
            error: error.message,
            details: error
        });
    }
};

// Crear una nueva reseña
const createReview = async (req, res) => {
    try {
        const newReview = new Review({
            ...req.body,
            usuario: req.user.id
        });
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error('Error completo:', error);
        console.log(req.user)
        res.status(500).json({
            message: "Error al crear la reseña",
            error: error.message,
            details: error
        }); 
    }
}

// Actualizar una reseña existente
const updateReview = async (req, res) => {
    try {

        // Comprobar si la reseña existe
        const rewiew = await Review.findById(req.params.id);
        if (!rewiew) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }

        // Validar que el usuario que intenta actualizar la reseña es el mismo que la creó
        if (rewiew.usuario.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "No tienes permiso para actualizar esta reseña" });
        }

        // Continuar con la actualización si la validación es exitosa

        const updateReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateReview) return res.status(404).json({ message: "Reseña no encontrada" });
        res.status(200).json(updateReview);
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            message: "Error al actualizar la reseña",
            error: error.message,
            details: error
        });
    }
};

// Eliminar una reseña
const deleteReview = async (req, res) => {
    try {
        const rewiew = await Review.findById(req.params.id);

        if (!rewiew) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }

        // Validar que la reseña tiene el campo usuario
        if (!rewiew.usuario) {
            return res
                .status(400)
                .json({ message: "La reseña no tiene usuario asociado" });
        }

        // Validar permisos
        if (rewiew.usuario.toString() !== req.user.id && req.user.rol !== 'admin') {
            return res.status(403).json({ message: "No tienes permiso para eliminar esta reseña" });
        }

        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Reseña eliminada correctamente" });
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            message: "Error al eliminar la reseña",
            error: error.message,
            details: error
        });
    }
};

export { getReview, getReviewById, getReviewByGameId, createReview, updateReview, deleteReview };