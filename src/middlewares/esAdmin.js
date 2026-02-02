const esAdmin = (req, res, next) => {
    // verificarTokenJWT ya puso req.usuario
    if (!req.usuario || req.usuario.rol !== "admin") {
        return res.status(403).json({
            msg: "Acceso denegado. Solo administradores 🚫"
        });
    }
    next();
};

export default esAdmin;
