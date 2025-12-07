import Usuario from "../models/Usuario.js";
import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js";

// =========================================================
// 🔵 REGISTRO
// =========================================================
const registro = async (req, res) => {
    try {
        const { correoInstitucional, password } = req.body;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos." });
        }

        const existe = await Usuario.findOne({ correoInstitucional });
        if (existe) {
            return res.status(400).json({ msg: "El correo institucional ya está registrado." });
        }

        const nuevoUsuario = new Usuario(req.body);
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password);

        const token = nuevoUsuario.createToken();
        nuevoUsuario.token = token;

        await sendMailToRegister(correoInstitucional, token);
        await nuevoUsuario.save();

        res.status(200).json({ msg: "Revisa tu correo institucional para confirmar tu cuenta." });

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor: ${error.message}` });
    }
};

// =========================================================
// 🔵 CONFIRMAR CORREO
// =========================================================
const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params;
        const usuarioBDD = await Usuario.findOne({ token });

        if (!usuarioBDD) {
            return res.redirect(`${process.env.URL_FRONTEND}/confirmar/error`);
        }

        usuarioBDD.token = null;
        usuarioBDD.confirmEmail = true;
        await usuarioBDD.save();

        return res.redirect(`${process.env.URL_FRONTEND}/confirmar/exito`);

    } catch {
        return res.redirect(`${process.env.URL_FRONTEND}/confirmar/error`);
    }
};

// =========================================================
// 🔵 RECUPERAR CONTRASEÑA
// =========================================================
const recuperarPassword = async (req, res) => {
    try {
        const { correoInstitucional } = req.body;

        if (!correoInstitucional) {
            return res.status(400).json({ msg: "Debes ingresar un correo electrónico" });
        }

        const usuarioBDD = await Usuario.findOne({ correoInstitucional });
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "El usuario no se encuentra registrado" });
        }

        const token = usuarioBDD.createToken();
        usuarioBDD.token = token;

        await sendMailToRecoveryPassword(correoInstitucional, token);
        await usuarioBDD.save();

        res.status(200).json({ msg: "Revisa tu correo electrónico para restablecer tu contraseña" });

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
};

// =========================================================
// 🔵 COMPROBAR TOKEN
// =========================================================
const comprobarTokenPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const usuarioBDD = await Usuario.findOne({ token });

        if (!usuarioBDD) {
            return res.status(404).json({ msg: "Token inválido" });
        }

        res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
};

// =========================================================
// 🔵 NUEVO PASSWORD
// =========================================================
const crearNuevoPassword = async (req, res) => {
    try {
        const { password, confirmpassword } = req.body;
        const { token } = req.params;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" });
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ msg: "Los passwords no coinciden" });
        }

        const usuarioBDD = await Usuario.findOne({ token });
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "Token inválido" });
        }

        usuarioBDD.password = await usuarioBDD.encryptPassword(password);
        usuarioBDD.token = null;

        await usuarioBDD.save();
        res.status(200).json({ msg: "Tu contraseña ha sido actualizada correctamente" });

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
};

// =========================================================
// 🔵 LOGIN
// =========================================================
const loginUsuario = async (req, res) => {
    try {
        const { correoInstitucional, password, rol } = req.body;

        if (!correoInstitucional || !password || !rol) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios" });
        }

        const usuarioBDD = await Usuario.findOne({ correoInstitucional });
        if (!usuarioBDD) return res.status(404).json({ msg: "Usuario no registrado" });
        if (!usuarioBDD.confirmEmail) return res.status(400).json({ msg: "Debes confirmar tu correo primero" });

        const passwordOK = await usuarioBDD.matchPassword(password);
        if (!passwordOK) return res.status(400).json({ msg: "Contraseña incorrecta" });

        if (usuarioBDD.rol !== rol) {
            return res.status(403).json({ msg: `No tienes permiso para ingresar como ${rol}.` });
        }

        const token = usuarioBDD.createJWT();
        res.status(200).json({
            msg: "Inicio de sesión exitoso",
            token,
            nombre: usuarioBDD.nombre,
            apellido: usuarioBDD.apellido,
            rol: usuarioBDD.rol
        });

    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor: ${error.message}` });
    }
};

// =========================================================
// 🔵 PERFIL
// =========================================================
const perfil = (req, res) => {
    const { password, token, resetToken, resetTokenExpire, ...usuarioSeguro } = req.usuario;
    res.status(200).json(usuarioSeguro);
};

// =========================================================
// 🔵 ACTUALIZAR PERFIL
// =========================================================
const actualizarUsuario = async (req, res) => {
    try {
        const { nombre, telefono, direccion, cedula, descripcion, universidad, carrera, avatar } = req.body;

        const usuarioBDD = await Usuario.findById(req.usuario._id);
        if (!usuarioBDD) return res.status(404).json({ msg: "Usuario no encontrado" });

        usuarioBDD.nombre = nombre || usuarioBDD.nombre;
        usuarioBDD.telefono = telefono || usuarioBDD.telefono;
        usuarioBDD.direccion = direccion || usuarioBDD.direccion;
        usuarioBDD.cedula = cedula || usuarioBDD.cedula;
        usuarioBDD.descripcion = descripcion || usuarioBDD.descripcion;
        usuarioBDD.universidad = universidad || usuarioBDD.universidad;
        usuarioBDD.carrera = carrera || usuarioBDD.carrera;
        usuarioBDD.avatar = avatar || usuarioBDD.avatar;

        await usuarioBDD.save();
        res.status(200).json({ msg: "Información actualizada correctamente" });

    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar información" });
    }
};

// =========================================================
// 🆕 🔵 ACTUALIZAR SOLO AVATAR (AÑADIDO)
// =========================================================
const actualizarAvatar = async (req, res) => {
    try {
        const { avatar } = req.body;

        if (!avatar) {
            return res.status(400).json({ msg: "Avatar no recibido" });
        }

        const usuarioBDD = await Usuario.findById(req.usuario._id);
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        usuarioBDD.avatar = avatar;
        await usuarioBDD.save();

        res.status(200).json({
            msg: "Avatar actualizado correctamente",
            avatar
        });

    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar avatar" });
    }
};

// =========================================================
// 🔵 ACTUALIZAR CONTRASEÑA
// =========================================================
const actualizarPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" });
        }

        const usuarioBDD = await Usuario.findById(req.usuario._id);
        if (!usuarioBDD) return res.status(404).json({ msg: "Usuario no encontrado" });

        const isMatch = await usuarioBDD.matchPassword(oldPassword);
        if (!isMatch) return res.status(400).json({ msg: "Contraseña actual incorrecta" });

        usuarioBDD.password = await usuarioBDD.encryptPassword(newPassword);
        await usuarioBDD.save();

        res.status(200).json({ msg: "Contraseña actualizada correctamente" });

    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar la contraseña" });
    }
};

// =========================================================
// ✅ EXPORTAR (CON AVATAR AÑADIDO)
// =========================================================
export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    loginUsuario,
    perfil,
    actualizarUsuario,
    actualizarAvatar, // ✅ AÑADIDO
    actualizarPassword
};
