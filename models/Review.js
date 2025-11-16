import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    juegoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true, trim: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, trim: true },
    calificacion: { type: Number, min: 1, max: 5, required: true },
    comentario: String,
    horasJugadas: { type: Number, default: 0, min: 0, max: 10000 },
    dificultad: { type: String, enum: ['Fácil', 'Normal', 'Difícil'], required: true, trim: true },
}, { timestamps: true});

const Review = mongoose.model('Review', reviewSchema);

export default Review;