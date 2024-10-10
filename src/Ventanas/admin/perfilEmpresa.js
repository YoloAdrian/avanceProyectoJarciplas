import React, { useEffect, useState } from 'react';
import './stylos_admin.css'; 

function PerfilEmpresa() {
  const [informacion, setInformacion] = useState([]);
  const [tiposInformacion, setTiposInformacion] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevaInformacion, setNuevaInformacion] = useState('');

  useEffect(() => {
    const fetchInformacion = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/informacion');
        const data = await response.json();
        setInformacion(data);
      } catch (error) {
        console.error('Error al obtener la información:', error);
      }
    };

    const fetchTiposInformacion = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/tipos_informacion');
        const data = await response.json();
        setTiposInformacion(data);
      } catch (error) {
        console.error('Error al obtener los tipos de información:', error);
      }
    };

    fetchInformacion();
    fetchTiposInformacion();
  }, []);

  const getTipoPorId = (id) => {
    const tipo = tiposInformacion.find((t) => t.id_tipo_informacion === id);
    return tipo ? tipo.tipo : 'Desconocido';
  };

  const manejarEdicion = (item) => {
    setEditandoId(item.id_informacion);
    setNuevaInformacion(item.informacion);
  };

  const guardarCambios = async (id, item) => {
    try {
      await fetch(`http://localhost:3001/api/informacion/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_tipo_informacion: item.id_tipo_informacion, // Mantener el tipo actual
          informacion: nuevaInformacion,
        }),
      });
      // Actualizar la lista después de guardar cambios
      const updatedInformacion = informacion.map((item) => {
        if (item.id_informacion === id) {
          return { ...item, informacion: nuevaInformacion };
        }
        return item;
      });
      setInformacion(updatedInformacion);
      setEditandoId(null);
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
  };

  const borrarCampo = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/informacion/campo/${id}`, {
        method: 'DELETE',
      });
      
      // Actualizar la lista para reflejar que el campo 'informacion' ha sido eliminado
      const updatedInformacion = informacion.map(item => {
        if (item.id_informacion === id) {
          return { ...item, informacion: null }; // Establecer 'informacion' a null
        }
        return item;
      });
      setInformacion(updatedInformacion);
    } catch (error) {
      console.error('Error al borrar el campo:', error);
    }
  };

  return (
    <div className="perfil-empresa-container">
      <h1>Perfil de Empresa</h1>
      <table className="informacion-table">
        <thead>
          <tr>
            <th>Tipo de Información</th>
            <th>Información</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {informacion.map((item) => (
            <tr key={item.id_informacion}>
              <td>{getTipoPorId(item.id_tipo_informacion)}</td>
              <td>{editandoId === item.id_informacion ? (
                <input
                  type="text"
                  value={nuevaInformacion}
                  onChange={(e) => setNuevaInformacion(e.target.value)}
                  className="input-informacion" 
                />
              ) : (
                item.informacion
              )}</td>
              <td>
                {editandoId === item.id_informacion ? (
                  <>
                    <button className='btn_guardar' onClick={() => guardarCambios(item.id_informacion, item)}>Guardar</button>
                    <button className='btn_borrar' onClick={cancelarEdicion}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className='btn_edit' onClick={() => manejarEdicion(item)}>Editar</button>
                    <button className='btn_borrar' onClick={() => borrarCampo(item.id_informacion)}>Borrar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PerfilEmpresa;
