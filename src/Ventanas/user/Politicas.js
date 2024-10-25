import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Politicas() {
  const [politica, setPolitica] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoliticaVigente = async () => {
      try {
        const response = await axios.get('https://backendjarciplas.onrender.com/api/politicas/vigente'); // Asegúrate de que la ruta sea correcta
        setPolitica(response.data);
      } catch (error) {
        setError('Error al obtener la política vigente');
        console.error(error);
      }
    };

    fetchPoliticaVigente();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!politica) {
    return <div>No hay políticas vigentes disponibles.</div>;
  }

  return (
    <div>
      <h1>{politica.titulo}</h1>
      <p>{politica.contenido}</p>
      <p><strong>Fecha de Creación:</strong> {new Date(politica.fecha_vigencia).toLocaleDateString()}</p>
    </div>
  );
}

export default Politicas;
