import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Ventanas/AuthContext'; // Aquí usamos el contexto de autenticación
import './index.css';

const Navbar = () => {
  const { usuario, cerrarSesion } = useAuth(); // Obtenemos el valor del contexto de AuthContext
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/'); // Redirige al inicio tras cerrar sesión
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Jarciplas</Link>
      </div>
      <ul className="navbar-links">
        {usuario === null ? (
          <>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/Login">Login</Link></li>
            <li><Link to="/Registro">Registro</Link></li>
          </>
        ) : usuario === 'usuario' ? (
          <>
            <li><Link to="/Catalogo">Catálogo</Link></li>
            <li><Link to="/PerfilUsuario">Mi Perfil</Link></li>
            <li><button className="btncerr" onClick={handleCerrarSesion}>Cerrar Sesión</button></li>
          </>
        ) : (
          <>
            <li><Link to="/PerfilEmpresa">Perfil Empresa</Link></li>
            <li><Link to="/Productos">Productos</Link></li>
            <li><Link to="/Roles"> Roles</Link></li>
            <li><button className="btncerr" onClick={handleCerrarSesion}>Cerrar Sesión</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;



