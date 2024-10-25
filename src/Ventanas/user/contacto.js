import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Contacto() {
  const [contactos, setContactos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactos = async () => {
      try {
        const response = await axios.get('https://backendjarciplas.onrender.com/api/contactos');
        setContactos(response.data);
      } catch (error) {
        setError('Error al obtener contactos');
        console.error(error);
      }
    };

    fetchContactos();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Contactos</h1>
      {contactos.length > 0 ? (
        <ul>
          {contactos.map(contacto => (
            <li key={contacto.id_contacto}>
              <h2>{contacto.nombre}</h2>
              <p>{contacto.informacion}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay contactos disponibles.</p>
      )}
    </div>
  );
}

export default Contacto;
