// app.js (Servidor listo para Koyeb + frontend en Vercel)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import usuarioRouter from "./routers/usuario_routes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();

// ================================
// ✅ CORS: permite frontend local y producción
// ================================
const allowedOrigins = [
  process.env.URL_FRONTEND,       // tu URL de producción (Vercel)
  "https://fronetd-u.vercel.app", // frontend en producción específico
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman o requests sin origin
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(null, false); // rechazamos otros orígenes sin romper preflight
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// ================================
// ✅ Middleware para preflight OPTIONS
// ================================
app.options("*", cors());

// ================================
// ✅ Middlewares
// ================================
app.use(express.json({ limit: "10mb" })); // para subir imágenes grandes

// ================================
// ✅ Cloudinary
// ================================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ================================
// ✅ Conexión a MongoDB
// ================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Error en MongoDB:", err));

// ================================
// ✅ Rutas
// ================================
app.get("/", (req, res) => res.send("🚀 Backend funcionando"));
app.use("/api/usuarios", usuarioRouter);

// ================================
// 404
// ================================
app.use((req, res) => res.status(404).json({ msg: "404 | Endpoint no encontrado" }));

// ================================
// ✅ Servidor
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
