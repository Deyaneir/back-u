import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import usuarioRouter from "./routers/usuario_routes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();

// ================================
// ✅ CORS CORREGIDO PARA KOYEB + VERCEL
// ================================
const allowedOrigins = [
  process.env.URL_FRONTEND,           // tu frontend real (Vercel)
  "https://diverse-janeta-epn-a654e5e7.koyeb.app",  // 🟩 tu backend
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];


app.use(cors({
  origin: (origin, callback) => {
    console.log("🟦 Origin que llega:", origin);

    if (!origin) return callback(null, true); // Postman, fetch interno

    // 🟩 CORRECCIÓN: eliminar la doble / del frontend
    const cleanOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS bloqueado por origen: " + cleanOrigin));
  },
  credentials: true
}));

// ================================
// Middlewares
// ================================
app.use(express.json({ limit: "10mb" }));

// ================================
// Cloudinary
// ================================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ================================
// Conexión a MongoDB
// ================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado correctamente"))
  .catch(err => console.error("❌ Error en MongoDB:", err));

// ================================
// Rutas
// ================================
app.get("/", (req, res) => res.send("🚀 Backend funcionando"));
app.use("/api/usuarios", usuarioRouter);

// ================================
// 404
// ================================
app.use((req, res) => res.status(404).json({ msg: "404 | Endpoint no encontrado" }));

// ================================
// Servidor
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Servidor corriendo en 0.0.0.0:${PORT}`);
});

export default app;
