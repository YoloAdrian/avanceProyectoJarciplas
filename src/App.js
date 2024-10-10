import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Nanvar';
import Inicio from './Ventanas/inicio';
import Login from './Ventanas/login';
import Registro from './Ventanas/registro';
import Admin from './Ventanas/admin';
import Usuarios from './Ventanas/usuarios';
import PerfilEmpresa from './Ventanas/admin/perfilEmpresa';
import Productos from './Ventanas/admin/productos';
import Catalogo from './Ventanas/user/catalogo';
import PerfilUsuario from './Ventanas/user/perfilUsuario';
import { AuthProvider } from './Ventanas/AuthContext'; // Importa el AuthProvider
import RecuperarContraseña from './Ventanas/user/recuperarContraseña';

const App = () => {
  return (
    <AuthProvider> {/* Aquí envuelves la app con el AuthProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path='/Usuarios' element={<Usuarios />} />
          <Route path='/PerfilEmpresa' element={<PerfilEmpresa />} />
          <Route path='/Productos' element={<Productos />} />
          <Route path='/Catalogo' element={<Catalogo />} />
          <Route path='/PerfilUsuario' element={<PerfilUsuario />} />
          <Route path='/RecuperarContraseña' element={<RecuperarContraseña/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
