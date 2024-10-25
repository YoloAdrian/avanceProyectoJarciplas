import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import './stylos.css';

const Login = () => {
  const [formulario, setFormulario] = useState({
    correo: '',
    contraseña: '',
    tokenMFA: '',
  });
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [qrCode, setQrCode] = useState(''); 
  const navigate = useNavigate();
  const { iniciarSesionComoUsuario, iniciarSesionComoAdmin } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [usuarioId, setUsuarioId] = useState(null);
  const [trabajadorId, setTrabajadorId] = useState(null);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
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
  
    if (executeRecaptcha) {
      const token = await executeRecaptcha('login');
      setCaptchaToken(token);
    } else {
      setError('Error al cargar reCAPTCHA.');
      return;
    }
  
    try {
      const captchaResponse = await fetch('https://backendjarciplas.onrender.com/api/verificar_captcha', {
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
      const respuestaUsuario = await fetch('https://backendjarciplas.onrender.com/api/usuarios/iniciar_sesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Correo: formulario.correo,
          Contraseña: formulario.contraseña,
        }),
      });
  
      const datosUsuario = await respuestaUsuario.json();
  
      if (respuestaUsuario.status === 403) {
        setError(datosUsuario.message); // Aquí mostramos el mensaje de cuenta bloqueada
        return;
      }
  
      if (respuestaUsuario.ok) {
        setUsuarioId(datosUsuario.id_usuario);
        setMfaRequired(true);
  
        // Generar el código QR para MFA
        const qrResponse = await fetch(`https://backendjarciplas.onrender.com/api/usuarios/${datosUsuario.id_usuario}/generar_mfa`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (qrResponse.ok) {
          const qrData = await qrResponse.json();
          setQrCode(qrData.qrCode);
        }
  
        setError('Se requiere verificación MFA. Ingresa el token MFA.');
        return;
      }
  
      // Iniciar sesión como trabajador
      const respuestaTrabajador = await fetch('https://backendjarciplas.onrender.com/api/trabajadores/iniciar_sesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Correo: formulario.correo,
          Contraseña: formulario.contraseña,
        }),
      });
  
      const datosTrabajador = await respuestaTrabajador.json();
  
      if (respuestaTrabajador.status === 403) {
        setError(datosTrabajador.message); // Aquí mostramos el mensaje de cuenta bloqueada
        return;
      }
  
      if (respuestaTrabajador.ok) {
        setTrabajadorId(datosTrabajador.id_trabajador);
        setMfaRequired(true);
  
        // Generar el código QR para MFA del trabajador
        const qrResponse = await fetch(`https://backendjarciplas.onrender.com/api/trabajadores/${datosTrabajador.id_trabajador}/generar_mfa`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (qrResponse.ok) {
          const qrData = await qrResponse.json();
          setQrCode(qrData.qrCode);
        }
  
        setError('Se requiere verificación MFA. Ingresa el token MFA.');
        return;
      }
  
      setError('Contraseña o correo incorrectos. Intenta de nuevo.');
    } catch (err) {
      setError('Error en la conexión.');
    }
  };
  

  const manejarTokenMFA = async (e) => {
    e.preventDefault();
    try {
      const endpoint = usuarioId 
        ? `https://backendjarciplas.onrender.com/api/usuarios/${usuarioId}/verificar_mfa`
        : `https://backendjarciplas.onrender.com/api/trabajadores/${trabajadorId}/verificar_mfa`;

      const respuestaMFA = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: formulario.tokenMFA,
        }),
      });

      if (respuestaMFA.ok) {
        if (usuarioId) {
          iniciarSesionComoUsuario();
          navigate('/Usuarios'); // Redirigir a la página de usuarios
        } else if (trabajadorId) {
          iniciarSesionComoAdmin();
          navigate('/Admin'); // Redirigir a la página de trabajadores/admin
        }
      } else {
        setError('Token MFA inválido. Inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Error en la conexión.');
    }
  };

  return (
    <form className="formulario-login" onSubmit={mfaRequired ? manejarTokenMFA : manejarSubmit} autoComplete="off">
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
            className="boton-ver" 
            onClick={() => setMostrarContraseña(!mostrarContraseña)}
            style={{ marginLeft: '10px' }}
          >
            {mostrarContraseña ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>
      </div>

      {mfaRequired && (
        <>
          <div className="codigo-qr">
            <h3>Escanea este código QR:</h3>
            {qrCode && <img src={qrCode} alt="Código QR para MFA" />} 
          </div>
          <div className="formulario-campo">
            <label>Token MFA:</label>
            <input
              className="input-texto"
              type="text"
              name="tokenMFA"
              value={formulario.tokenMFA}
              onChange={manejarCambio}
              required
            />
          </div>
        </>
      )}

{!mfaRequired && (
  <div className="formulario-recuperar">
    <Link to="/RecuperarContraseña">¿Olvidaste tu contraseña?</Link>
  </div>
)}


      {error && <p className="error">{error}</p>}

      <div className="formulario-botones">
        <button className="btn iniciar-sesion" type="submit">
          {mfaRequired ? 'Verificar MFA' : 'Iniciar Sesión'}
        </button>
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