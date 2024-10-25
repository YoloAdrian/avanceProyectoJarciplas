import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Ventanas/AuthContext'; // Aquí usamos el contexto de autenticación
import axios from 'axios'; // Para hacer solicitudes a la API
import './index.css';

const Navbar = () => {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  
  const [empresa, setEmpresa] = useState({ nombre: '' }); // Estado para el nombre de la empresa
  const [dropdownOpen, setDropdownOpen] = useState(null); // Estado para controlar qué dropdown está abierto (ninguno, usuarios o regulatorios)

  // Función para obtener la información de la empresa
  useEffect(() => {
    const obtenerInformacionEmpresa = async () => {
      try {
        const response = await axios.get('https://backendjarciplas.onrender.com/api/informacion'); // Asegúrate de que la URL sea correcta
        if (response.data && response.data.length > 0) {
          setEmpresa({ nombre: response.data[0].nombre }); // Tomar el nombre de la primera (y única) entrada
        }
      } catch (error) {
        console.error('Error al obtener la información de la empresa', error);
      }
    };

    obtenerInformacionEmpresa();
  }, []);

  // Función para cerrar sesión
  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/'); // Redirige al inicio tras cerrar sesión
  };

  // Función para alternar los dropdowns
  const toggleDropdown = (menu) => {
    setDropdownOpen(dropdownOpen === menu ? null : menu);
  };

  // Función para cerrar los menús si se hace clic fuera de ellos
  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown')) {
      setDropdownOpen(null);
    }
  };

  // Añadir un evento de clic en cualquier parte del documento
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">{empresa.nombre}</Link> {/* Usamos el nombre de la empresa en lugar de "Jarciplas" */}
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
            <li><Link to="/Productos">Productos</Link></li>
            <li><Link to="/AdminDatosEmpresa">Información Empresa</Link></li>
            <li>
              <div className="dropdown">
                <button onClick={() => toggleDropdown('usuarios')} className="dropdown-btn">
                  Administración usuarios
                </button>
                {dropdownOpen === 'usuarios' && (
                  <ul className="dropdown-content">
                    <li><Link to="/AdminConfiguracion">Configuraciones</Link></li>
                    <li><Link to="/Roles">Roles</Link></li>
                    <li><Link to="/AdminBloqueos">Bloqueos</Link></li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <div className="dropdown">
                <button onClick={() => toggleDropdown('regulatorios')} className="dropdown-btn">
                  Documentos regulatorios
                </button>
                {dropdownOpen === 'regulatorios' && (
                  <ul className="dropdown-content">
                    <li><Link to="/AdminPoliticas">Políticas</Link></li>
                    <li><Link to="/AdminTerminos">Términos</Link></li>
                    <li><Link to="/AdminDeslinde">Deslinde</Link></li>
                  </ul>
                )}
              </div>
            </li>
            <li><button className="btncerr" onClick={handleCerrarSesion}>Cerrar Sesión</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
