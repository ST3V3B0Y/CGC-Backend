import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "$Colgame2025$";

export const validarToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    // Verificar si el token existe
    
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            correo: decoded.correo,
            rol: decoded.rol
        }; // Agregar la información del usuario al objeto de la solicitud
        next();
    } catch (error) {
        console.error('Error completo:', error);
        res.status(400).json({
            message: "Token inválido",
            error: error.message,
            details: error
        });
    }
};
