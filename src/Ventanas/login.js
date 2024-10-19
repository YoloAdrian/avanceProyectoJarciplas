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
  const [tiempoBloqueo, setTiempoBloqueo] = useState(300); 
  const [captchaToken, setCaptchaToken] = useState(null); // Token de reCAPTCHA
  const navigate = useNavigate();
  const { iniciarSesionComoUsuario, iniciarSesionComoAdmin } = useAuth();

  const { executeRecaptcha } = useGoogleReCaptcha();
  const manejarCambio = (e) => {
    const { name, value } = e.target;
  
    // Definir listas blancas
    const regexCorreo = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/; 
    const regexContraseña = /^[\w@#%&*+=-]{8,20}$/; 
  
    // Actualizar el estado sin bloquear la entrada
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));
  
    // Validar según el campo y mostrar errores
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

    if (cuentaBloqueada) {
      setError(`Tu cuenta está bloqueada. Intenta de nuevo en ${tiempoBloqueo} segundos.`);
      return;
    }

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

       // iniciar sesión como usuario
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
        iniciarSesionComoUsuario(); 
        navigate('/Usuarios'); 
        return;
      }
  
      //iniciar sesión como trabajador
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
        iniciarSesionComoAdmin(); 
        navigate('/Admin'); 
        return;
      }

      
      setIntentos(prevIntentos => {
        const nuevosIntentos = prevIntentos + 1;
        if (nuevosIntentos >= 5) {
          setCuentaBloqueada(true); 
          setTiempoBloqueo(300);
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
      setIntentos(0); 
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
        <Link to="/RecuperarContraseña">¿Olvidaste tu contraseña?</Link>
      </div>

      {error && <p className="error">{error}</p>}

      {cuentaBloqueada && (
        <p> </p>
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
