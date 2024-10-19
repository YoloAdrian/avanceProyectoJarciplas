import React, { useState } from 'react';
import axios from 'axios';

function CodigoGmail() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3001/api/enviar-codigo', { email });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      setMessage('Error al enviar el código. Intenta de nuevo.');
    }
  };

  return (
    <div>
      <h2>Enviar Código de Verificación :</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Generar Código</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CodigoGmail;
