import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import gameRoutes from "./routes/gameRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors()); //Habilita CORS para permitir solicitudes desde otros dominios
app.use(express.json()); //Parsea el cuerpo de las solicitudes como JSON
app.use(morgan("dev")); //Permite ver las peticiones en la consola
// Fin Middlewares

// Rutas
app.use("/api/games", gameRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", userRoutes);
// Fin Rutas

// Conexión a la base de datos MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado éxitosamente a la base de datos en MongoDB Atlas"))
  .catch((error) => console.error("❌ Error al conectar a la base de datos:", error));
  
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT} http://localhost:${PORT}`));
// ----------------------------------------- //