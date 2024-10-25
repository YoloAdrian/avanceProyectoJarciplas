import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Terminos() {
  const [terminos, setTerminos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerminosVigentes = async () => {
      try {
        // Realiza la solicitud a la API para obtener los términos vigentes
        const response = await axios.get('https://backendjarciplas.onrender.com/api/terminos/vigente');
        setTerminos(response.data);
      } catch (error) {
        // Manejo de errores en caso de que la solicitud falle
        setError('No hay terminos y condiciones vigentes');
        console.error(error);
      }
    };

    fetchTerminosVigentes();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!terminos) {
    return <div className="no-terminos">No hay términos vigentes disponibles.</div>;
  }

  return (
    <div className="terminos-vigentes">
      <h1>{terminos.titulo}</h1>
      <p>{terminos.contenido}</p>
      <p><strong>Fecha de Vigencia:</strong> {new Date(terminos.fecha_vigencia).toLocaleDateString()}</p>
    </div>
  );
}

export default Terminos;
