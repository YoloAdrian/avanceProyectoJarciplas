import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const iniciarSesionComoUsuario = () => setUsuario('usuario');
  const iniciarSesionComoAdmin = () => setUsuario('admin');
  const cerrarSesion = () => setUsuario(null);

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesionComoUsuario, iniciarSesionComoAdmin, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
