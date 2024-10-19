// ExpiracionSesion.js
import { useEffect } from 'react';
import { useAuth } from './AuthContext';

const ExpiracionSesion = () => {
  const { cerrarSesion } = useAuth(); // Aquí se puede usar

  useEffect(() => {
    const timeoutDuration = 120000; // 2 minutos
    let timeout;

    const bloquearUsuario = () => {
      const tiempoExpiracion = Date.now() + timeoutDuration;
      localStorage.setItem('bloqueo', tiempoExpiracion); // Guardar el tiempo de bloqueo en localStorage
    };

    const estaBloqueado = () => {
      const tiempoExpiracion = localStorage.getItem('bloqueo');
      if (!tiempoExpiracion) return false; // No hay bloqueo configurado
      const ahora = Date.now();
      return ahora < tiempoExpiracion; // Si el tiempo actual es menor al tiempo de expiración, sigue bloqueado
    };

    const cerrarSesionYBloquear = () => {
      cerrarSesion(); // Cierra la sesión
      bloquearUsuario(); // Bloquear al usuario por el tiempo especificado
    };

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);

      // Si el usuario está bloqueado, no reiniciar el temporizador
      if (estaBloqueado()) {
        cerrarSesionYBloquear();
        return;
      }

      // Configurar el temporizador para cerrar sesión si hay inactividad
      timeout = setTimeout(() => {
        cerrarSesionYBloquear();
      }, timeoutDuration);
    };

    // Verificar si el usuario ya está bloqueado al cargar la página
    if (estaBloqueado()) {
      cerrarSesionYBloquear();
    }

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
