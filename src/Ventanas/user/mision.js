import React, { useEffect, useState } from 'react';
import './stylos_user.css'; 

const InformacionAgrupada = () => {
  const [informaciones, setInformaciones] = useState([]);

  useEffect(() => {
    const fetchInformacion = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/informacion');
        const data = await response.json();
        const ultimasTres = data.slice(-3); 
        setInformaciones(ultimasTres);
      } catch (error) {
        console.error('Error al obtener la información:', error);
      }
    };

    fetchInformacion();
  }, []);

  
  const titulos = ['Visión', 'Misión', 'Quiénes Somos'];

  return (
    <div className="informacion-agrupar">
      {informaciones.map((info, index) => (
        <div key={index} className="infcajaagrup">
          
          <h3 className="informacion-subtitulo_agrupar">{titulos[index] || `Información ${index + 1}`}</h3>
          <p className="informacion-contenido_agrupar">{info.informacion || 'Cargando...'}</p>
        </div>
      ))}
    </div>
  );
};

export default InformacionAgrupada;
