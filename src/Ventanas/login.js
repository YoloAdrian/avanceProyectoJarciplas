import React, { useState, useEffect } from 'react';
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
  const [intentos, setIntentos] = useState(0);
  const [cuentaBloqueada, setCuentaBloqueada] = useState(false);
  const [tiempoBloqueo, setTiempoBloqueo] = useState(300); // Tiempo de bloqueo en segundos (5 minutos)
  const [captchaToken, setCaptchaToken] = useState(null); // Token de reCAPTCHA
  const navigate = useNavigate();
  const { iniciarSesionComoUsuario, iniciarSesionComoAdmin } = useAuth();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    if (cuentaBloqueada) {
      setError(`Tu cuenta está bloqueada. Intenta de nuevo en ${tiempoBloqueo} segundos.`);
      return;
    }

    // Ejecutar reCAPTCHA
    if (executeRecaptcha) {
      const token = await executeRecaptcha('login'); // 'login' es el nombre de la acción
      setCaptchaToken(token); // Guardar el token
    } else {
      setError('Error al cargar reCAPTCHA.');
      return;
    }

    try {
      // Verificar el token de reCAPTCHA en el backend
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

       // Intentar iniciar sesión como usuario
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
        const usuario = await respuestaUsuario.json();
        iniciarSesionComoUsuario(); // Maneja la sesión como usuario
        navigate('/Usuarios'); // Redirigir a la ruta de usuarios
        return;
      }
  
      // Intentar iniciar sesión como trabajador
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
        const trabajador = await respuestaTrabajador.json();
        iniciarSesionComoAdmin(); // Maneja la sesión como trabajador
        navigate('/Admin'); // Redirigir a la ruta de trabajadores
        return;
      }

      // Incrementar el contador de intentos fallidos
      setIntentos(prevIntentos => {
        const nuevosIntentos = prevIntentos + 1;
        if (nuevosIntentos >= 5) {
          setCuentaBloqueada(true); // Bloquear la cuenta después de 5 intentos
          setTiempoBloqueo(300); // Establecer el tiempo de bloqueo en 300 segundos (5 minutos)
          setError('Tu cuenta ha sido bloqueada debido a múltiples intentos fallidos. Intenta más tarde.');
        } else {
          setError('Contraseña o correo incorrectos. Intenta de nuevo.');
        }
        return nuevosIntentos;
      });
    } catch (err) {
      setError('Error en la conexión example');
    }
  };

  useEffect(() => {
    if (cuentaBloqueada && tiempoBloqueo > 0) {
      const timer = setInterval(() => {
        setTiempoBloqueo(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (tiempoBloqueo === 0) {
      setCuentaBloqueada(false);
      setError('Puedes intentar iniciar sesión de nuevo.');
      setIntentos(0); // Reiniciar los intentos
    }
  }, [cuentaBloqueada, tiempoBloqueo]);

  const formatoTiempo = (tiempo) => {
    const minutos = Math.floor(tiempo / 60);
    const segundos = tiempo % 60;
    return `${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
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
        <Link to="/CodigoGmail">¿Olvidaste tu contraseña?</Link>
      </div>

      {error && <p className="error">{error}</p>}

      {cuentaBloqueada && (
        <p className="cronometro">Tiempo restante: {formatoTiempo(tiempoBloqueo)}</p>
      )}

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
