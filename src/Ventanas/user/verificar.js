import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Verificacion = ({ datosUsuarioTemp }) => {
  const location = useLocation();
  const { datosUsuario } = location.state || {}; // Acceder a los datos del estado

  // const { datosUsuario } = useUsuario();

  // Ahora puedes usar datosUsuario en tu componente
  console.log( "json =>",datosUsuario);


  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarVerificacion = async (e) => {
    e.preventDefault();

    // console.log('Datos del usuario temporal:', datosUsuarioTemp); // Verifixºca los datos

    try {
      const respuesta = await fetch('https://backendjarciplas.onrender.com/api/verificar-codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo, datosUsuario: datosUsuario }),
        
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setMensaje('Código verificado exitosamente. ¡Bienvenido!');
      } else {
        setMensaje(data.message || 'Código incorrecto. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
      setMensaje('Error en la verificación. Intenta de nuevo.');
    }
  };

  return (
    <form onSubmit={manejarVerificacion}>
      <label>Código de Verificación:</label>
      <input
        type="text"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        required
      />
      <button type="submit">Verificar</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
};

export default Verificacion;