import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Nanvar';
import Inicio from './Ventanas/inicio';
import Login from './Ventanas/login';
import Registro from './Ventanas/registro';
import Admin from './Ventanas/admin';
import Usuarios from './Ventanas/usuarios';
import AdminPoliticas from './Ventanas/admin/adminPoliticas';
import Productos from './Ventanas/admin/productos';
import Catalogo from './Ventanas/user/catalogo';
import PerfilUsuario from './Ventanas/user/perfilUsuario';
import { AuthProvider } from './Ventanas/AuthContext'; 
import RecuperarContraseña from './Ventanas/user/recuperarContraseña';
import ExpiracionSesion from './Ventanas/expiracionSesion'; 
import { TemaProvider, useTema } from './contextoTema';
import CambiarTema from './cambiarTema';
import Roles from './Ventanas/admin/roles'
import FooterUsuario from './fotterUsuario';
import RutaProtegida from './Ventanas/rutaProtegida'; 
import Terminos from './Ventanas/user/terminos';
import Politicas from './Ventanas/user/Politicas'; // Importar el componente
import Deslinde from './Ventanas/user/deslinde';
import Contacto from './Ventanas/user/contacto';
import AdminTerminos from './Ventanas/admin/adminTerminos';
import AdminDeslinde from './Ventanas/admin/adminDeslinde';
import AdminBloqueos from './Ventanas/admin/adminBloqueos';
import AdminDatosEmpresa from './Ventanas/admin/adminContactosEmpresa';
import AdminConfiguracion from './Ventanas/admin/adminConfiguracion';
import Verificacion from './Ventanas/user/verificar';

const App = () => {
  return (
    <TemaProvider>
      <AuthProvider>
        <Router>
          <ExpiracionSesion />
          <Navbar />
          <CambiarTema /> 
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Inicio />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Registro" element={<Registro />} />
            <Route path="/Terminos" element={<Terminos/>} />
            <Route path="/Deslinde" element={<Deslinde />} />
            <Route path="/Contacto" element={<Contacto />} />
            <Route path="/Politicas" element={<Politicas />} />
            <Route path="/Verificar" element={<Verificacion />} />

            {/* Rutas protegidas para 'usuario' */}
            <Route 
              path="/Catalogo" 
              element={
                <RutaProtegida permitido={['usuario']}>
                  <Catalogo />
                </RutaProtegida>
              } 
            />

            <Route 
              path="/Usuarios" 
              element={
                <RutaProtegida permitido={['usuario']}>
                  <Usuarios />
                </RutaProtegida>
              } 
            />
            <Route 
              path="/PerfilUsuario" 
              element={
                <RutaProtegida permitido={['usuario']}>
                  <PerfilUsuario />
                </RutaProtegida>
              } 
            />

            {/* Rutas protegidas para 'admin' */}
            <Route 
              path="/AdminPoliticas" 
              element={
                <RutaProtegida permitido={['admin']}>
                  <AdminPoliticas />
                </RutaProtegida>
              } 
            />

          <Route 
              path="/AdminTerminos" 
              element={
                <RutaProtegida permitido={['admin']}>
                  <AdminTerminos />
                </RutaProtegida>
              } 
            />

          <Route 
              path="/AdminDeslinde" 
              element={
                <RutaProtegida permitido={['admin']}>
                  <AdminDeslinde/>
                </RutaProtegida>
              } 
          />

          <Route 
              path="/AdminBloqueos" 
              element={
                <RutaProtegida permitido={['admin']}>
                  <AdminBloqueos/>
                </RutaProtegida>
              } 
          />

        <Route 
              path="/AdminDatosEmpresa" 
              element={
                <RutaProtegida permitido={['admin']}>
                  <AdminDatosEmpresa/>
                </RutaProtegida>
              } 
          />

          <Route 
              path="/AdminConfiguracion" 
              element={
                <RutaProtegida permitido={['admin']}>
                  <AdminConfiguracion/>
                </RutaProtegida>
              } 
          />
            <Route 
              path="/Admin" 
              element={
                <RutaProtegida permitido={['admin']}>
                  <Admin />
                </RutaProtegida>
              } 
            />
            <Route 
              path="/Productos" 
              element={
                <RutaProtegida permitido={['admin']}>
                  <Productos />
                </RutaProtegida>
              } 
            />
            <Route 
              path="/Roles" 
              element={
                <RutaProtegida permitido={['admin']}>
                  <Roles />
                </RutaProtegida>
              } 
            />

            {/* Otras rutas públicas */}
            <Route path='/RecuperarContraseña' element={<RecuperarContraseña />} />
          </Routes>
          <FooterUsuario />
        </Router>
      </AuthProvider>
    </TemaProvider>
  );
};

export default App;
