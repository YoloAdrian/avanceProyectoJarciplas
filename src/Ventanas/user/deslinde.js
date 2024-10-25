import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Deslinde() {
  const [deslinde, setDeslinde] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeslindeVigente = async () => {
      try {
        const response = await axios.get('https://backendjarciplas.onrender.com/api/deslinde_legal/vigente'); // Asegúrate de que la ruta sea correcta
        setDeslinde(response.data);
      } catch (error) {
        setError('No hay deslindes vigentes');
        console.error(error);
      }
    };

    fetchDeslindeVigente();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!deslinde) {
    return <div>No hay deslindes vigentes disponibles.</div>;
  }

  return (
    <div>
      <h1>{deslinde.titulo}</h1>
      <p>{deslinde.contenido}</p>
      <p><strong>Fecha de Vigencia:</strong> {new Date(deslinde.fecha_vigencia).toLocaleDateString()}</p>
    </div>
  );
}

export default Deslinde;
