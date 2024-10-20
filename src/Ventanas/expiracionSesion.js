import { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const ExpiracionSesion = () => {
  const { cerrarSesion } = useAuth();
  const navigate = useNavigate(); // Inicializar useNavigate

  useEffect(() => {
    const timeoutDuration = 1200000; // 20 minutos
    let timeout;

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        cerrarSesion(); // Cerrar sesión si el tiempo de inactividad se alcanza
        navigate('/'); // Redirigir al inicio
      }, timeoutDuration);
    };

    // Eventos para detectar actividad del usuario
    const eventos = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    eventos.forEach((evento) => {
      window.addEventListener(evento, resetTimer);
    });

    // Configurar el temporizador inicialmente
    resetTimer();

    // Limpiar eventos y timeout al desmontar
    return () => {
      eventos.forEach((evento) => {
        window.removeEventListener(evento, resetTimer);
      });
      clearTimeout(timeout);
    };
  }, [cerrarSesion, navigate]); // Añadir navigate a las dependencias

  return null; // No renderiza nada
};

export default ExpiracionSesion;

