// ./routers/usuario_routes.js

import express from "express";

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

const router = express.Router();

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
router.put("/avatar", verificarTokenJWT, actualizarAvatar);

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
