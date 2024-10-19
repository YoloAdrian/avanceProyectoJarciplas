import React, { useEffect, useState } from 'react';
import './stylos_user.css'; 

const InformacionGeneral = () => {
  const [informacion, setInformacion] = useState('');

  useEffect(() => {
    const fetchInformacion = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/informacion/3'); 
        const data = await response.json();
        setInformacion(data.informacion);
      } catch (error) {
        console.error('Error al obtener la información:', error);
      }
    };

    fetchInformacion();
  }, []);

  return (
    <div className="informacion-general">
      <h2 className="informacion-titulo">Avisos de privacidad</h2>
      <div className="informacion-caja">
        <p className="informacion-contenido">{informacion || 'Cargando...'}</p>
      </div>
    </div>
  );
};

export default InformacionGeneral;
