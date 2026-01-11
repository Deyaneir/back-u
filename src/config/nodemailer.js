// src/config/nodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ==============================
// 🔹 Verificar variables de entorno
// ==============================
const { USER_EMAIL, USER_PASS, URL_BACKEND, URL_FRONTEND } = process.env;

if (!USER_EMAIL || !USER_PASS || !URL_BACKEND || !URL_FRONTEND) {
  throw new Error("❌ Falta configurar alguna variable de entorno en .env");
}

// ==============================
// 🔹 Transportador SMTP Gmail (CORREGIDO)
// ==============================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,          // ⬅️ CAMBIO CLAVE
  secure: false,      // ⬅️ CAMBIO CLAVE (TLS)
  auth: {
    user: USER_EMAIL,
    pass: USER_PASS,
  },
});

// ✅ Verificación SMTP (MUY IMPORTANTE)
transporter.verify((error) => {
  if (error) {
    console.error("❌ ERROR SMTP:", error);
  } else {
    console.log("✅ SMTP listo para enviar correos");
  }
});

// ==============================
// 🔹 Función genérica de envío
// ==============================
const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: USER_EMAIL, // ⬅️ CAMBIO CLAVE (evita bloqueo Outlook)
      to,
      subject,
      html,
    });

    console.log("📩 Email enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error enviando email:", error.message);
    return null;
  }
};

// ==============================
// 🟣 CORREO DE CONFIRMACIÓN
// ==============================
const sendMailToRegister = async (userMail, token) => {
  const urlConfirm = `${URL_FRONTEND}/#/confirmar/${token}`;

  const html = `
    <h1>Bienvenido a Vibe-U 🎓</h1>
    <p>Gracias por registrarte. Confirma tu correo:</p>
    <a href="${urlConfirm}">Confirmar correo</a>
    <p>Si no creaste esta cuenta, ignora este mensaje.</p>
  `;

  return sendMail(userMail, "Confirma tu cuenta en Vibe-U", html);
};

// ==============================
// 🟣 RECUPERACIÓN DE PASSWORD
// ==============================
const sendMailToRecoveryPassword = async (userMail, token) => {
  const urlRecovery = `${URL_FRONTEND}/#/recuperarpassword/${token}`;

  const html = `
    <h1>Vibe-U</h1>
    <p>Restablece tu contraseña:</p>
    <a href="${urlRecovery}">Restablecer contraseña</a>
  `;

  return sendMail(userMail, "Recupera tu contraseña en Vibe-U", html);
};

// ==============================
export {
  sendMail,
  sendMailToRegister,
  sendMailToRecoveryPassword,
};
