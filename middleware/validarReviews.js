import { body, validationResult } from 'express-validator';

// Middleware para validar los datos de las reseñas

export const validarReview = [
    body('juegoId').notEmpty().withMessage('El juego es requerido').isMongoId(),
    body('calificacion').notEmpty().withMessage('La calificación es requerida').isInt({ min: 1, max: 5 }).withMessage('La calificación debe estar entre 1 y 5'),
    body('dificultad').notEmpty().withMessage('La dificultad es requerida').isIn(['Fácil', 'Normal', 'Difícil']).withMessage('La dificultad debe ser Fácil, Normal o Difícil'),
    body('horasJugadas').optional().isInt({ min: 0, max: 10000 }).withMessage('Las horas jugadas deben estar entre 0 y 10000'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Errores de validación:', errors.array());
            return res.status(400).json({
                message: "Errores de validación en los datos de la reseña",
                errors: errors.array()
            });
        }
        next();
    }
];
