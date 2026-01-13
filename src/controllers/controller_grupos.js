const Grupo = require('../models/Grupos');

// Listar todos los grupos
exports.listarGrupos = async (req, res) => {
    try {
        const grupos = await Grupo.find().sort({ createdAt: -1 });
        res.json(grupos);
    } catch (error) {
        res.status(500).json({ message: "Error al listar grupos" });
    }
};

// Crear un nuevo grupo
exports.crearGrupo = async (req, res) => {
    try {
        const nuevoGrupo = new Grupo(req.body);
        const grupoGuardado = await nuevoGrupo.save();
        res.status(201).json(grupoGuardado);
    } catch (error) {
        res.status(400).json({ message: "Error al crear el grupo" });
    }
};

// Unirse a un grupo
exports.unirseGrupo = async (req, res) => {
    try {
        const { correo } = req.body;
        const grupo = await Grupo.findById(req.params.id);
        if (!grupo.miembrosArray.includes(correo)) {
            grupo.miembrosArray.push(correo);
            await grupo.save();
        }
        res.json({ message: "Unido con éxito", grupo });
    } catch (error) {
        res.status(400).json({ message: "Error al unirse" });
    }
};

// Abandonar grupo
exports.abandonarGrupo = async (req, res) => {
    try {
        const { correo } = req.body;
        const grupo = await Grupo.findById(req.params.id);
        grupo.miembrosArray = grupo.miembrosArray.filter(m => m !== correo);
        await grupo.save();
        res.json({ message: "Has abandonado el grupo" });
    } catch (error) {
        res.status(400).json({ message: "Error al abandonar" });
    }
};

// Eliminar grupo
exports.eliminarGrupo = async (req, res) => {
    try {
        await Grupo.findByIdAndDelete(req.params.id);
        res.json({ message: "Grupo eliminado" });
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar" });
    }
};

// Publicar un post en el muro del grupo
exports.crearPost = async (req, res) => {
    try {
        const { autor, contenido, foto } = req.body;
        const grupo = await Grupo.findById(req.params.id);
        const nuevoPost = { autor, contenido, foto };
        grupo.posts.unshift(nuevoPost); // Pone el post al inicio
        await grupo.save();
        res.status(201).json(grupo.posts[0]);
    } catch (error) {
        res.status(400).json({ message: "Error al publicar post" });
    }
};
