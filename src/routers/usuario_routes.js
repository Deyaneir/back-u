// ./routers/usuario_routes.js

import express from "express";
import multer from "multer"; // ✅ Para recibir archivos
import fs from "fs";
import {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    loginUsuario,
    perfil,
    actualizarUsuario,
    actualizarPassword,
    actualizarAvatar // ✅ AÑADIDO (NO EXISTÍA EN REMOTO)
} from "../controllers/usuario_controller.js";

import { verificarTokenJWT } from "../middlewares/JWT.js"; 
import { v2 as cloudinary } from "cloudinary"; // ✅ Cloudinary
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Carpeta temporal para archivos

// =========================================================
// 🔵 Rutas de Autenticación
// =========================================================
router.post("/register", registro);
router.get("/confirmar/:token", confirmarMail);
router.post("/login", loginUsuario);

// 🔵 Rutas de Recuperación de Contraseña
router.post("/olvide-password", recuperarPassword);
router.get("/olvide-password/:token", comprobarTokenPassword);
router.post("/reset-password/:token", crearNuevoPassword);

// =========================================================
// 🔵 Rutas de Perfil Protegido
// =========================================================
router.get("/perfil", verificarTokenJWT, perfil);

router.put("/actualizar", verificarTokenJWT, actualizarUsuario);

router.put("/actualizar/password", verificarTokenJWT, actualizarPassword);

// ================================
// ✅ AVATAR (Cloudinary) — AÑADIDO
// ================================
router.put("/avatar", verificarTokenJWT, upload.single("avatar"), async (req, res) => {
    try {
        const userName = req.user.name || req.user.username; // Ajusta según tu objeto usuario
        if (!req.file) {
            return res.status(400).json({ error: "No se envió ningún archivo" });
        }

        // Subida a Cloudinary en carpeta por usuario
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `usuarios/${userName}`,
            overwrite: true,
        });

        // Elimina archivo temporal
        fs.unlinkSync(req.file.path);

        // Llama a tu controlador existente para actualizar avatar en BD
        const updatedUser = await actualizarAvatar(req.user.id, result.secure_url);

        res.json({ message: "Avatar actualizado correctamente", user: updatedUser, url: result.secure_url });
    } catch (error) {
        console.error("Error al actualizar avatar:", error);
        res.status(500).json({ error: "No se pudo actualizar el avatar" });
    }
});

// =========================================================
// 🟣 Frase motivadora
// =========================================================
router.get("/frase", async (req, res) => {
    try {
        const response = await fetch("https://zenquotes.io/api/random");
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error al obtener la frase:", error);
        res.status(500).json({ error: "No se pudo obtener la frase motivadora" });
    }
});

export default router;
