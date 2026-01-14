import Grupo from '../models/Grupos.js';

// Listar grupos
export const listarGrupos = async (req, res) => {
    try {
        const grupos = await Grupo.find().sort({ createdAt: -1 });
        res.json(grupos);
    } catch (error) {
        res.status(500).json({ message: "Error al listar grupos" });
    }
};

// Crear grupo
export const crearGrupo = async (req, res) => {
    try {
        const nuevoGrupo = new Grupo(req.body);
        const grupoGuardado = await nuevoGrupo.save();
        res.status(201).json(grupoGuardado);
    } catch (error) {
        res.status(400).json({ message: "Error al crear el grupo" });
    }
};

// Unirse a un grupo
export const unirseGrupo = async (req, res) => {
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
export const abandonarGrupo = async (req, res) => {
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
export const eliminarGrupo = async (req, res) => {
    try {
        await Grupo.findByIdAndDelete(req.params.id);
        res.json({ message: "Grupo eliminado" });
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar" });
    }
};

// Publicar un post
export const crearPost = async (req, res) => {
    try {
        // AUMENTO: Capturamos 'autorFoto' del body
        const { autor, autorFoto, contenido, foto } = req.body;
        const grupo = await Grupo.findById(req.params.id);
        
        // AUMENTO: Incluimos 'autorFoto' en el objeto para que coincida con tu Grupos.js
        const nuevoPost = { 
            autor, 
            autorFoto, 
            contenido, 
            foto 
        };
        
        grupo.posts.unshift(nuevoPost);
        await grupo.save();
        
        // Retornamos el post recién creado
        res.status(201).json(grupo.posts[0]);
    } catch (error) {
        res.status(400).json({ message: "Error al publicar post" });
    }
};
