import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: [true, 'Nombre de usuario requerido'], trim: true, unique: true, minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'] },
    correo: { type: String, required: [true, 'Correo electrónico requerido'], trim: true, unique: true, match: [/.+\@.+\..+/, 'Por favor ingrese un correo electrónico válido'] },
    contraseña: { type: String, required: [true, 'Contraseña requerida'], minlength: [6, 'La contraseña debe tener al menos 6 caracteres'], trim: true},
    rol: { type: String, enum: ['usuario', 'admin'], default: 'usuario', trim: true },
}, { timestamps: true });

// Hashear la contraseña antes de guardar el usuario

userSchema.pre('save', async function (next) {
    if (!this.isModified('contraseña')) return next();
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
});

export default mongoose.model('User', userSchema);