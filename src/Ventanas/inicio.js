import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Inicio() {
  const [empresa, setEmpresa] = useState({ nombre: '', eslogan: '', logo: '' });

  useEffect(() => {
    // Función para obtener la información de la empresa
    const obtenerInformacionEmpresa = async () => {
      try {
        // Realiza una solicitud GET para obtener la información de la empresa
        const response = await axios.get('https://backendjarciplas.onrender.com/api/informacion');
        const data = response.data[0]; // Tomamos la primera (y única) entrada de la respuesta

        // Realiza una solicitud GET para obtener el logo de la empresa
        const logoResponse = await axios.get(`https://backendjarciplas.onrender.com/api/informacion/logo/${data.id_informacion}`, {
          responseType: 'blob', // Esto permite obtener los datos como un blob de imagen
        });

        // Convertir el blob en una URL de imagen
        const logoUrl = URL.createObjectURL(logoResponse.data);

        // Actualiza el estado con la información obtenida
        setEmpresa({
          nombre: data.nombre,
          eslogan: data.eslogan,
          logo: logoUrl,
        });
      } catch (error) {
        console.error('Error al obtener la información de la empresa:', error);
      }
    };

    obtenerInformacionEmpresa();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
      <h1>Bienvenidos a  {empresa.nombre}</h1>
      <p>{empresa.eslogan}</p>
      <img
        src={empresa.logo}
        alt="Logo de la empresa"
        style={{ width: '40%', maxWidth: '500px', margin: '20px 0' }}
      />
      <h2>Nuestra gama de productos incluye:</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li>Desinfectantes y limpiadores</li>
        <li>Jabones y detergentes</li>
        <li>Artículos de limpieza industrial</li>
        <li>Productos ecológicos</li>
      </ul>
      <p>
        Contáctanos para obtener más información o para realizar tu pedido.
        Estamos aquí para ayudarte a mantener tus espacios limpios y seguros.
      </p>
    </div>
  );
}

export default Inicio;
