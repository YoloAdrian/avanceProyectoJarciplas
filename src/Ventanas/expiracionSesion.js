// ExpiracionSesion.js
import { useEffect } from 'react';
import { useAuth } from './AuthContext';

const ExpiracionSesion = () => {
  const { cerrarSesion } = useAuth(); // Aquí se puede usar

  useEffect(() => {
    const timeoutDuration = 120000; // 2 minutos
    let timeout;

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        cerrarSesion(); // Cerrar sesión si el tiempo de inactividad se alcanza
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
  }, [cerrarSesion]);

  return null; // No renderiza nada
};

export default ExpiracionSesion;

