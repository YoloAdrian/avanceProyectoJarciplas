import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Importa tu contexto de autenticación

// Componente que protegerá las rutas
const RutaProtegida = ({ children, permitido }) => {
  const { usuario } = useAuth(); // Obtenemos el usuario autenticado

  // Verificamos si el usuario está autorizado para ver la página
  if (!usuario || (permitido && !permitido.includes(usuario))) {
    // Si el usuario no está autorizado, lo redirigimos al inicio o login
    return <Navigate to="/" />;
  }

  // Si está autorizado, renderizamos el componente hijo
  return children;
};

export default RutaProtegida;
