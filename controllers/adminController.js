import User from '../models/User.js'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'

// Crear un usuario administrador
export const createAdminUser = async (req, res) => {
    try {
        const { nombre, correo, contraseña } = req.body;

        // Validar inexistencia de usuario administrador
        const existingAdmin = await User.findOne({ correo: "admin@colgamecloud.com", rol: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ message: "Ya existe un usuario administrador"});
        }

        const newAdmin = new User({
            nombre: "Admin",    
            correo: "admin@colgamecloud.com",
            contraseña: "Adm1n****",
            rol: 'admin'
        });

        await newAdmin.save();

        res.status(201).json({ message: "Usuario administrador creado exitosamente", newAdmin });
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({ message: "Error al crear el usuario administrador", error: error.message, details: error });
    }
};

