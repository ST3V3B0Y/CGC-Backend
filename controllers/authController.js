import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Controladores para manejar las operaciones relacionadas con los usuarios

const JWT_SECRET = process.env.JWT_SECRET || "$Colgame2025$";


// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    try {
        const { nombre, correo, contraseña } = req.body;

        // Validar datos básicos
        if (!nombre || !correo || !contraseña) {
            return res.status(400).json({ message: "Todos los campos son obligatorios"})
        }

        // Validar existencia de usuario
        const existingUser = await User.findOne({ correo });
        if (existingUser) {
            return res.status(400).json({ message: "Usuario ya registrado" });
        }

        const token = jwt.sign(
            { id: User._id, nombre: User.nombre, rol: User.rol },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        const newUser = new User({
            nombre,
            correo,
            contraseña
        });

        await newUser.save();

        return res.status(201).json({
            message: "Usuario registrado con éxito",
            user: {
                id: newUser._id,
                nombre: newUser.nombre,
                correo: newUser.correo,
            }, token,
         });
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            message: "Error al registrar el usuario",
            error: error.message,
            details: error
        });
    }
};

// Login de usuarios

export const loginUser = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        // Verificar si el usuario existe
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(400).json({ message: "Usuario incorrecto o no encontrado" });
        }

        // DEBUG: Mostrar hash almacenado y contraseña recibida
        console.log('DEBUG loginUser: contraseña recibida:', contraseña);
        console.log('DEBUG loginUser: hash almacenado:', user.contraseña);

        // Verificar la contraseña primero
        try {
            const isMatch = await bcrypt.compare(contraseña, user.contraseña);
            if (!isMatch) {
                return res.status(400).json({ message: "Contraseña incorrecta" });
            }
        } catch (error) {
            console.error('Error verificando contraseña:', error);
            return res.status(500).json({ message: "Error al verificar la contraseña" });
        }

        // Crear y enviar el token JWT usando la constante JWT_SECRET definida arriba
        let token;
        try {
            token = jwt.sign(
                { id: user._id, nombre: user.nombre, rol: user.rol },
                JWT_SECRET,
                { expiresIn: '2h' }
            );
        } catch (error) {
            console.error('Error creando JWT:', error);
            return res.status(500).json({ message: "Error al crear el token de sesión" });
        }

        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
                id: user._id,
                nombre: user.nombre,
                correo: user.correo,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            message: "Error al iniciar sesión",
            error: error.message,
            details: error
        });
    }
};

// Consultar todos los usuarios

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-contraseña") // Sin mostrar contraseñas
        res.status(200).json(users);
    } catch (error) {
        console.error("Error al obtener los usuarios: ", error);
        res.status(500).json({
            message: "Error al obtener los usuarios",
            error: error.message
        });
    }
};

// Consultar usuario por ID

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, "-contraseña");
        if (!user) {
            return res.status(404).json({ message: "Usuario no emcontrado" })
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error al obtener el usuario: ", error);
        res.status(500).json({
            message: "Error al obtener el usuario",
            error: error.message
        });
    }
};

// Editar usuario por ID

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo, contraseña, rol } = req.body;

        // Validar rol de admin para poder actualizar
        if (req.user.rol !== 'admin' && req.user.id !== id) {
            return res.status(403).json({ message: "No tienes permisos para actualizar este usuario" });
        }        

        // Buscar el usuario
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Actualizar datos
        if (nombre) user.nombre = nombre;
        if (correo) user.correo = correo;
        if (rol) user.rol = rol;
        if (contraseña) {
            const salt = await bcrypt.genSalt(10);
            user.contraseña = await bcrypt.hash(contraseña, salt)
        }

        // Guardar cambios
        await user.save();

        res.status(200).json({
            message: "Usuario actualizado con éxito",
            user: {
                id: user._id,
                nombre: user.nombre,
                correo: user.correo,
                rol: user.rol
            }
        })

    } catch (error) {
        console.error("Error al actualizar el usuario", error);
        res.status(500).json({
            message: "Error al actualizar el usuario",
            error: error.message,
            details: error
        })
    }
};

// Eliminar un usuario por ID 

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar el usuario", error);
        res.status(500).json({
            message: "Error al eliminar el usuario",
            error: error.message
        });
    }
};

// Endpoint temporal de prueba (NO USAR EN PRODUCCIÓN)
export const testPassword = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        // Generar un nuevo hash con la contraseña proporcionada
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(contraseña, salt);
        
        // Comparar usando bcrypt.compare
        const isMatch = await bcrypt.compare(contraseña, user.contraseña);
        
        console.log('Test - Contraseña recibida:', contraseña);
        console.log('Test - Hash almacenado:', user.contraseña);
        console.log('Test - Nuevo hash generado:', newHash);
        console.log('Test - Resultado de bcrypt.compare:', isMatch);
        
        res.json({
            correoRecibido: correo,
            contraseñaRecibida: contraseña,
            hashAlmacenado: user.contraseña,
            nuevoHashGenerado: newHash,
            coincide: isMatch,
            debugInfo: {
                contraseñaLength: contraseña.length,
                hashLength: user.contraseña.length,
                hashStartsWith: user.contraseña.substring(0, 7),
                saltUsado: salt
            }
        });
    } catch (error) {
        console.error('Error en test:', error);
        res.status(500).json({ 
            error: error.message,
            stack: error.stack 
        });
    }
};

