const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    autor: String,
    contenido: String,
    foto: String, // Base64 o URL
    fecha: { type: Date, default: Date.now }
});

const GrupoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    imagen: { type: String }, // Foto de portada/perfil
    creadorEmail: { type: String, required: true },
    miembrosArray: { type: [String], default: [] }, // Lista de correos de miembros
    posts: [PostSchema]
}, { timestamps: true });

module.exports = mongoose.model('Grupo', GrupoSchema);
