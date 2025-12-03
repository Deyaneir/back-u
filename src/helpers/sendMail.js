import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
// Importamos los iconos de Heroicons (aunque no los estás usando en tu código actual, es buena práctica mantener la importación)
// import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

// 🛑 CORRECCIÓN: Usamos una URL de placeholder genérica para evitar el error de "archivo no encontrado".
const PLACEHOLDER_LOGO_URL = 'https://placehold.co/130x130/8a3dff/ffffff?text=Vibe+U';

export const Confirm = () => {
  const { token } = useParams();
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const confirmarCuenta = async () => {
     // Se asume que VITE_BACKEND_URL está correctamente configurada en Vercel
     const urlBackend = import.meta.env.VITE_BACKEND_URL;
     // 🛑 LOG DE DIAGNÓSTICO CRÍTICO: Muestra la URL completa que se está llamando.
     const urlAPI = `${urlBackend}/api/usuarios/confirmar/${token}`;
     console.log("🟦 Llamando a la API de confirmación en:", urlAPI); // <<-- ¡LOG CRÍTICO!
     
      try {
        const res = await axios.get(urlAPI);
        setMensaje(res.data?.msg || "Cuenta confirmada ✅");
      } catch (error) {
        console.error("❌ Error de la API:", error.response || error);
        // Si el estado es 404 o 500, puedes mostrar un mensaje más específico.
        const errorMsg = error.response?.data?.msg || `Error ${error.response?.status || 'desconocido'}: Token inválido o ya confirmado`;
        setMensaje(errorMsg);
      } finally {
        setCargando(false);
        setTimeout(() => setFadeIn(true), 50); // activa animación
      }
    };
    confirmarCuenta();
  }, [token]);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#ffb07c,#9f6bff)',
      padding: '20px',
      overflow: 'hidden',
    },
    card: {
      background: 'white',
      width: '400px',
      padding: '50px 40px',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      textAlign: 'center',
      position: 'relative',
      opacity: fadeIn ? 1 : 0,
      transform: fadeIn ? 'scale(1)' : 'scale(0.8)',
      transition: 'opacity 0.8s ease, transform 0.8s ease',
    },
    image: {
      width: '130px',
      height: '130px',
      borderRadius: '50%',
      marginBottom: '25px',
      border: '4px solid #8a3dff',
      objectFit: 'cover',
    },
    mensaje: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333',
    },
    subMensaje: {
      fontSize: '18px',
      color: '#555',
      marginBottom: '25px',
    },
    button: {
      width: '100%',
      padding: '15px',
      background: '#8a3dff',
      color: 'white',
      fontSize: '18px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: '.3s',
    },
  };

  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg,#ffb07c,#9f6bff)' }}>
        <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>Verificando tu cuenta...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Usamos la URL de placeholder en lugar de la importación fallida */}
        <img src={PLACEHOLDER_LOGO_URL} alt="Logo Vibe-U" style={styles.image} />
        <p style={styles.mensaje}>{mensaje}</p>
        <p style={styles.subMensaje}>
            {mensaje.includes('confirmada') ? 'Ya puedes iniciar sesión' : 'Por favor, verifica el enlace o intenta registrarte de nuevo.'}
        </p>
        <Link to="/login">
          <button style={styles.button}>Ir al Login</button>
        </Link>
      </div>
      {/* Mantenemos el log para que puedas verlo en la consola de Vercel (si está configurado) */}
    </div>
  );
};
