// Middleware para validar si el usuario es administrador
export const validarAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "No se encontró información del usuario en la solicitud." });
        }

        if (req.user.rol !== 'admin') {
            return res.status(403).json({ message: "Acceso denegado. Se requieren privilegios de administrador." });
        }
        next(); // Continua si es admin
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            message: "Error al verificar privilegios de administrador",
            error: error.message,
            details: error
        });
    }
};

