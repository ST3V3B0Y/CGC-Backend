import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    titulo: { type: String, required: [true, 'Nombre requerido'], trim: true, unique: true, minlength: [1, 'El nombre debe tener al menos 1 carácter']   },
    categoria: { type: String, required: [true, 'Género requerido'] , trim: true},
    plataforma: { type: String, required: [true, 'Plataforma requerida'], trim: true },
    añoLanzamiento: { type: Number, required: [true, 'Año de lanzamiento requerido'], min: 1950, max: new Date().getFullYear(), trim: true },
    desarrollador: { type: String, required: [true, 'Desarrollador requerido'], trim: true },
    imagenPortada: String,
    descripcion: String,
    completado: { type: Boolean, default: false },
}, {timestamps: true});

const Game = mongoose.model('Game', gameSchema);

export default Game;

