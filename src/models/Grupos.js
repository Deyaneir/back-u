import mongoose from 'mongoose'; // <-- Cambiado de require a import

const PostSchema = new mongoose.Schema({
    autor: String,
    contenido: String,
    foto: String, 
    fecha: { type: Date, default: Date.now }
});

const GrupoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    imagen: { type: String }, 
    creadorEmail: { type: String, required: true },
    miembrosArray: { type: [String], default: [] }, 
    posts: [PostSchema]
}, { timestamps: true });

// ✅ Cambiado de module.exports a export default
const Grupo = mongoose.model('Grupo', GrupoSchema);
export default Grupo;
