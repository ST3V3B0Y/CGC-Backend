import express from 'express';
import { validarAdmin } from '../middleware/validarAdmin.js';

import { createAdminUser } from "../controllers/authController.js";

// Ruta para crear un usuario administrador
// router.post('/create-admin', createAdminUser);