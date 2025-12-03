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
    actualizarPassword
} from "../controllers/usuario_controller.js";

// Asegúrate de que este middleware verifica el token JWT y lo decodifica.
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
// 🔵 Rutas de Perfil Protegido (Precedidas por /api/usuarios)
// =========================================================

// ✅ GET /api/usuarios/perfil: Devuelve la información del usuario
router.get("/perfil", verificarTokenJWT, perfil);

// ✅ PUT /api/usuarios/actualizar: Actualiza los datos del usuario
router.put("/actualizar", verificarTokenJWT, actualizarUsuario);

// PUT /api/usuarios/actualizar/password
router.put("/actualizar/password", verificarTokenJWT, actualizarPassword);

// =========================================================
// 🟣 Frase motivadora (GET /api/usuarios/frase)
// =========================================================
router.get("/frase", async (req, res) => {
    try {
        const response = await fetch("https://zenquotes.io/api/random");
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error al obtener la frase:", error);
        // Si falla la API externa, devolvemos un 500 para informar al frontend
        res.status(500).json({ error: "No se pudo obtener la frase motivadora" });
    }
});

export default router;
