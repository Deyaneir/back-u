// app.js (Servidor corregido)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import usuarioRouter from "./routers/usuario_routes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();

// ================================
// ✅ CORS CORREGIDO (Koyeb + Vercel + Local)
// ================================
const allowedOrigins = [
  process.env.URL_FRONTEND, 
  "https://fronetd-u.vercel.app",  // ⬅ TU FRONTEND REAL
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, ""); // quita / final

    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    return callback(new Error("⛔ CORS bloqueado por origen: " + cleanOrigin));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Preflight
app.options('/*', handler);  // ✅ ruta comodín válida


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
// MongoDB
// ================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Error MongoDB:", err));

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
