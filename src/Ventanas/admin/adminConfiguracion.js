import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminConfiguracion() {
  const [cantidadErrores, setCantidadErrores] = useState(null); // Inicializar como null
  const [newCantidadErrores, setNewCantidadErrores] = useState(null);
  const idConfiguracion = 1; // Suponiendo que solo hay un ID de configuración

  // Función para obtener la configuración desde la API
  const obtenerConfiguracion = async () => {
    try {
      const response = await axios.get(`https://backendjarciplas.onrender.com/api/configuracion/cantidad_errores/${idConfiguracion}`);
      console.log('Response Data:', response.data);

      // Verificamos que la respuesta contenga un campo cantidad_errores
      if (response.data && typeof response.data.cantidad_errores === 'number') {
        setCantidadErrores(response.data.cantidad_errores);
        setNewCantidadErrores(response.data.cantidad_errores);
      } else {
        console.error('El campo cantidad_errores no existe o es de tipo incorrecto');
      }
    } catch (error) {
      console.error('Error al obtener la configuración:', error);
    }
  };

  // Ejecuta la obtención de configuración cuando el componente se monta
  useEffect(() => {
    obtenerConfiguracion();
  }, []);

  // Función para actualizar la configuración a través de la API
  const actualizarConfiguracion = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://backendjarciplas.onrender.com/api/configuracion/${idConfiguracion}`, {
        cantidad_errores: newCantidadErrores,
      });
      alert('Configuración actualizada correctamente');
      setCantidadErrores(newCantidadErrores); // Actualiza el estado para reflejar el nuevo valor
    } catch (error) {
      console.error('Error al actualizar la configuración:', error);
    }
  };

  return (
    <div className="admin-configuracion-contenedor">
      <h2>Configuración de Errores</h2>
      <div className="admin-configuracion-seccion">
        <p><strong>Cantidad de Errores Actual:</strong> 
          {cantidadErrores !== null ? cantidadErrores : 'Cargando...'}
        </p>
        <form className="admin-configuracion-formulario" onSubmit={actualizarConfiguracion}>
          <label htmlFor="cantidadErroresInput">Nueva Cantidad de Errores:</label>
          <input
            id="cantidadErroresInput"
            type="number"
            min="0"
            value={newCantidadErrores !== null ? newCantidadErrores : 0}
            onChange={(e) => setNewCantidadErrores(parseInt(e.target.value, 10))}
            required
          />
          <button type="submit" className="admin-politicas-boton admin-politicas-boton-editar">
            Actualizar
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminConfiguracion;

