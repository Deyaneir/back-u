import express from "express";
import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js";
import bcrypt from "bcryptjs";
import { verificarTokenJWT } from "../middlewares/JWT.js";
import { perfil, actualizarUsuario, actualizarPassword } from "../controllers/usuario_controller.js";
import fetch from "node-fetch";

const router = express.Router();

const BLACKLISTED_DOMAINS = [
    "gmail.com", "hotmail.com", "outlook.com", "yahoo.com",
    "aol.com", "live.com", "icloud.com", "mail.com"
];

const domainCheck = (req, res, next) => {
    const { correoInstitucional } = req.body;
    if (correoInstitucional) {
        const dominio = correoInstitucional.split("@")[1];
        if (BLACKLISTED_DOMAINS.includes(dominio)) {
            console.log(`❌ Correo rechazado por restricción: ${correoInstitucional}`);
            return res.status(400).json({
                msg: "Solo se permiten correos institucionales o académicos."
            });
        }
    }
    next();
};

/* ------------------------------
   REGISTRO, LOGIN, CONFIRM, PASSWORD
   (igual que tu código)
------------------------------- */
router.post("/register", domainCheck, async (req, res) => { /* ... */ });
router.get("/confirmar/:token", async (req, res) => { /* ... */ });
router.post("/login", async (req, res) => { /* ... */ });
router.post("/olvide-password", async (req, res) => { /* ... */ });
router.post("/reset-password/:token", async (req, res) => { /* ... */ });

/* ---------------------------------------------------
   FRASE MOTIVADORA
---------------------------------------------------- */
router.get("/frase", async (req, res) => {
    try {
        // ⚡ API externa
        const response = await fetch("https://zenquotes.io/api/random");
        if (!response.ok) throw new Error("No se pudo obtener la frase");

        const data = await response.json();

        // 💡 Aseguramos el formato
        const frase = data[0]?.q || "¡Sigue adelante!";
        const autor = data[0]?.a || "Desconocido";

        res.json({ q: frase, a: autor });
    } catch (error) {
        console.error("ERROR FRASE:", error);

        // 🔹 Fallback si falla la API externa
        res.json({ q: "¡Nunca dejes de aprender!", a: "Sistema" });
    }
});

router.get("/perfil", verificarTokenJWT, perfil);
router.put("/actualizar-perfil", verificarTokenJWT, actualizarUsuario);
router.put("/actualizar-password", verificarTokenJWT, actualizarPassword);

export default router;
