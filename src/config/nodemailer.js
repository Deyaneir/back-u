// src/config/nodemailer.js
import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

// 🔹 Variables de entorno necesarias
const {
  USER_EMAIL,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  URL_BACKEND,
  URL_FRONTEND
} = process.env;

if (!USER_EMAIL || !GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !URL_BACKEND || !URL_FRONTEND) {
  throw new Error("❌ Falta configurar alguna variable de entorno en .env");
}

// 🔹 Configurar OAuth2
const oAuth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  "https://vu-chi.vercel.app/api/usuarios/google/callback" // redirect URI
);

oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

// ======================================================
// 🚫 Lista negra de dominios
// ======================================================
const blackListDomains = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "live.com",
  "aol.com",
  "msn.com",
  "icloud.com",
  "protonmail.com"
];

const isBlackListed = (email) => {
  const domain = email.split("@")[1]?.toLowerCase();
  return blackListDomains.includes(domain);
};

// ======================================================
// 🔹 Función genérica para enviar correos
// ======================================================
const sendMail = async (to, subject, html) => {
  if (isBlackListed(to)) {
    console.log(`❌ Correo bloqueado por lista negra: ${to}`);
    throw new Error("Correo no permitido. Usa tu correo institucional.");
  }

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER_EMAIL,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const info = await transporter.sendMail({
      from: `"Vibe-U 🎓" <${USER_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("📩 Email enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    throw error;
  }
};

// ======================================================
// 🟣 Correo de confirmación de registro
// ======================================================
const sendMailToRegister = async (userMail, token) => {
  const urlConfirm = `${URL_BACKEND}/api/usuarios/confirmar/${token}`;
  const html = `
    <h1>Bienvenido a Vibe-U 🎓</h1>
    <p>Gracias por registrarte. Confirma tu correo haciendo clic en el siguiente enlace:</p>
    <a href="${urlConfirm}" style="display:inline-block;background:#7c3aed;color:white;
       padding:10px 20px;text-decoration:none;border-radius:8px;font-weight:bold;">
       Confirmar correo
    </a>
    <br><br>
    <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
    <hr>
    <footer>El equipo de Vibe-U 🎓</footer>
  `;

  return sendMail(userMail, "Confirma tu cuenta en VIBE-U 💜", html);
};

// ======================================================
// 🟣 Correo de recuperación de contraseña
// ======================================================
const sendMailToRecoveryPassword = async (userMail, token) => {
  const urlRecovery = `${URL_FRONTEND}/recuperarpassword/${token}`;
  const html = `
    <h1>Vibe-U 💜</h1>
    <p>Has solicitado restablecer tu contraseña.</p>
    <a href="${urlRecovery}" style="display:inline-block;background:#7c3aed;color:white;
      padding:10px 20px;text-decoration:none;border-radius:8px;font-weight:bold;">
      Restablecer contraseña
    </a>
    <br><br>
    <p>Si no solicitaste este cambio, ignora este mensaje.</p>
    <hr>
    <footer>El equipo de Vibe-U 💜</footer>
  `;

  return sendMail(userMail, "Recupera tu contraseña en Vibe-U 🎓", html);
};

// ======================================================
// 🔹 Exportar funciones
// ======================================================
export {
  sendMail,
  sendMailToRegister,
  sendMailToRecoveryPassword
};
