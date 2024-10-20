import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import './stylos.css';

const Login = () => {
  const [formulario, setFormulario] = useState({
    correo: '',
    contraseña: ''
  });
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null); // Token de reCAPTCHA
  const navigate = useNavigate();
  const { iniciarSesionComoUsuario, iniciarSesionComoAdmin } = useAuth();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    // Definir listas blancas
    const regexCorreo = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/; 
    const regexContraseña = /^[\w@#%&*+=-]{8,20}$/; 

    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));

    if (name === 'correo' && value && !regexCorreo.test(value)) {
      setError('Correo electrónico no válido.');
    } else if (name === 'contraseña' && value && !regexContraseña.test(value)) {
      setError('El formato de contraseña no coincide');
    } else {
      setError('');
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    // Ejecutar reCAPTCHA
    if (executeRecaptcha) {
      const token = await executeRecaptcha('login'); 
      setCaptchaToken(token); 
    } else {
      setError('Error al cargar reCAPTCHA.');
      return;
    }

    try {
      // Verificar el token de reCAPTCHA 
      const captchaResponse = await fetch('http://localhost:3001/api/verificar_captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ captchaToken }),
      });

      const captchaData = await captchaResponse.json();

      if (!captchaData.success) {
        setError('Verificación de reCAPTCHA fallida. Inténtalo de nuevo.');
        return;
      }

      // Iniciar sesión como usuario
      const respuestaUsuario = await fetch('http://localhost:3001/api/usuarios/iniciar_sesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Correo: formulario.correo,
          Contraseña: formulario.contraseña,
        }),
      });

      if (respuestaUsuario.ok) {
        iniciarSesionComoUsuario();
        navigate('/Usuarios');
        return;
      }

      // Iniciar sesión como trabajador
      const respuestaTrabajador = await fetch('http://localhost:3001/api/trabajadores/iniciar_sesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Correo: formulario.correo,
          Contraseña: formulario.contraseña,
        }),
      });

      if (respuestaTrabajador.ok) {
        iniciarSesionComoAdmin();
        navigate('/Admin');
        return;
      }

      setError('Contraseña o correo incorrectos. Intenta de nuevo hols.');
    } catch (err) {
      setError('Error en la conexión.');
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
            {mostrarContraseña ? <AiFillEyeInvisible /> : <AiFillEye />}
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

const App = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6Ld-o2AqAAAAAN3ox0SJCvc7JOAzTap3eaosiy4p">
      <Login />
    </GoogleReCaptchaProvider>
  );
};

export default App;

