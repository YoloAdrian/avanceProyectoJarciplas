import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; 
import './stylos.css';

const Login = () => {
  const [formulario, setFormulario] = useState({
    correo: '',
    contraseña: ''
  });
  const [mostrarContraseña, setMostrarContraseña] = useState(false); 
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { iniciarSesionComoUsuario, iniciarSesionComoAdmin } = useAuth();

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    try {
      const respuestaUsuario = await fetch('http://localhost:3001/api/usuarios');
      const usuarios = await respuestaUsuario.json();

      const usuarioEncontrado = usuarios.find(usuario => 
        usuario.Correo === formulario.correo && usuario.Contraseña === formulario.contraseña
      );

      if (usuarioEncontrado) {
        iniciarSesionComoUsuario();
        navigate('/Usuarios');
        return;
      }

      const respuestaTrabajador = await fetch('http://localhost:3001/api/trabajadores');
      const trabajadores = await respuestaTrabajador.json();

      const trabajadorEncontrado = trabajadores.find(trabajador => 
        trabajador.Correo === formulario.correo && trabajador.contraseña === formulario.contraseña
      );

      if (trabajadorEncontrado) {
        iniciarSesionComoAdmin();
        navigate('/Admin');
        return;
      }

      setError('Contraseña o correo incorrectos intenta de nuevo');
    } catch (err) {
      setError('Error en la conexión');
    }
  };

  return (
    <form className="formulario-login" onSubmit={manejarSubmit} autoComplete="off">
      <div className="formulario-campo">
        <label>Correo:</label>
        <input
          className="input-texto"
          type="email"
          name="correo"
          value={formulario.correo}
          onChange={manejarCambio}
          required
        />
      </div>

      <div className="formulario-campo">
        <label>Contraseña:</label>
        <div className="input-con-ico">
          <input
            className="input-pass"
            type={mostrarContraseña ? 'text' : 'password'}
            name="contraseña"
            value={formulario.contraseña}
            onChange={manejarCambio}
            required
            minLength="8"
          />
          <button 
            type="button" 
            className="btn-mostrar" 
            onClick={() => setMostrarContraseña(!mostrarContraseña)}
            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
          >
            {mostrarContraseña ? <AiFillEyeInvisible /> : <AiFillEye/>}
          </button>
        </div>
      </div>

      <div className="formulario-recuperar">
        <Link to="/RecuperarContraseña">¿Olvidaste tu contraseña?</Link>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="formulario-botones">
        <button className="btn iniciar-sesion" type="submit">Iniciar Sesión</button>
      </div>
    </form>
  );
};

export default Login;
