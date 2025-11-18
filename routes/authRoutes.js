import express from 'express';
import { registerUser, loginUser, getUsers, getUserById, deleteUser, updateUser, testPassword } from '../controllers/authController.js';
import { body } from 'express-validator'; 
import { validarToken } from '../middleware/validarUser.js'
import { validarAdmin } from '../middleware/validarAdmin.js';
import { createAdminUser } from '../controllers/adminController.js';


const router = express.Router();



// Ruta para registrar un nuevo usuario

router.post('/register', 
    [
        body('nombre').notEmpty().withMessage('El nombre es requerido').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
        body('correo').notEmpty().withMessage('El correo electrónico es requerido').isEmail().withMessage('Ingrese un correo electrónico válido'),
        body('contraseña').notEmpty().withMessage('La contraseña es requerida').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres') // .isStrongPassword().withMessage('La contraseña debe ser más fuerte') // Validación de contraseña fuerte
    ],
    registerUser
);

// Ruta para el login del usuario

router.post('/login',
    [
        body('correo').notEmpty().withMessage('El correo electrónico es requerido').isEmail().withMessage('Ingrese un correo electrónico válido'),
        body('contraseña').notEmpty().withMessage('La contraseña es requerida')
    ],
    loginUser
);

// -- Rutas reservadas para administrador -- //

// router.post('/mkadm', createAdminUser) //
// Ruta para consultar todos los usuarios
router.get('/', validarToken, validarAdmin, getUsers)
//Ruta para consultar usuario por ID
router.get('/:id', validarToken, validarAdmin, getUserById)
// Ruta para actualizar un usuario por ID
router.put('/:id', validarToken, validarAdmin, updateUser)
// Ruta para eliminar un usuario
router.delete('/:id', validarToken, validarAdmin, deleteUser)


// ---------------------------------------- //

// Ruta temporal para probar contraseñas (NO USAR EN PRODUCCIÓN)
router.post('/test-password', testPassword);

export default router;