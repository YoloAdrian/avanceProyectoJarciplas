import React, { useEffect, useState } from 'react';
import './stylos_admin.css'; // Reutilizando los mismos estilos de políticas

function AdminDeslinde() {
  const [deslindes, setDeslindes] = useState([]);
  const [editandoDeslinde, setEditandoDeslinde] = useState(null);
  const [tituloEditado, setTituloEditado] = useState('');
  const [contenidoEditado, setContenidoEditado] = useState('');
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoContenido, setNuevoContenido] = useState('');

  useEffect(() => {
    obtenerDeslindes();
  }, []);

  const obtenerDeslindes = async () => {
    try {
      const response = await fetch('https://backendjarciplas.onrender.com/api/deslinde_legal');
      const data = await response.json();
      setDeslindes(data);
    } catch (error) {
      console.error('Error al obtener los deslindes legales:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`https://backendjarciplas.onrender.com/api/deslinde_legal/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        obtenerDeslindes();
      } else {
        const errorData = await response.json();
        console.error('Error al eliminar el deslinde legal:', errorData);
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
    }
  };

  const handleActualizar = async (id) => {
    const deslindeActualizado = {
      titulo: tituloEditado,
      contenido: contenidoEditado,
    };

    const response = await fetch(`https://backendjarciplas.onrender.com/api/deslinde_legal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deslindeActualizado),
    });

    if (response.ok) {
      obtenerDeslindes();
      setEditandoDeslinde(null);
    } else {
      const errorData = await response.json();
      console.error('Error al actualizar el deslinde legal:', errorData);
    }
  };

  const handleCrear = async () => {
    const newDeslinde = {
      titulo: nuevoTitulo,
      contenido: nuevoContenido,
      fecha_vigencia: new Date().toISOString().split('T')[0],
    };

    const response = await fetch('https://backendjarciplas.onrender.com/api/deslinde_legal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDeslinde),
    });

    if (response.ok) {
      obtenerDeslindes();
      setNuevoTitulo('');
      setNuevoContenido('');
    } else {
      const errorData = await response.json();
      console.error('Error al crear el deslinde legal:', errorData);
    }
  };

  const handleEditarClick = (deslinde) => {
    setEditandoDeslinde(deslinde.id_deslinde);
    setTituloEditado(deslinde.titulo);
    setContenidoEditado(deslinde.contenido);
  };

  const handleCancelarEdicion = () => {
    setEditandoDeslinde(null);
    setTituloEditado('');
    setContenidoEditado('');
  };

  const deslindeVigente = deslindes.find(deslinde => deslinde.estado === 'vigente');
  const deslindesAnteriores = deslindes.filter(deslinde => deslinde.estado !== 'vigente');

  return (
    <div className="admin-politicas-contenedor">
      <div className="admin-politicas-formulario">
        <h2>Crear Nuevo Deslinde Legal</h2>
        <input
          className='imput_crud'
          type="text"
          placeholder="Título"
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
        />
        <textarea
          className='imput_crud'
          placeholder="Contenido"
          value={nuevoContenido}
          onChange={(e) => setNuevoContenido(e.target.value)}
        />
        <button className="admin-politicas-boton-crear" onClick={handleCrear}>Crear Deslinde</button>
      </div>

      {deslindeVigente && (
        <div className="admin-politicas-vigente">
          <h2>Deslinde Legal Vigente</h2>
          <table className="admin-politicas-tabla">
            <thead>
              <tr>
                <th>Título</th>
                <th>Contenido</th>
                <th>Fecha Creación</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              <tr key={deslindeVigente.id_deslinde}>
                {editandoDeslinde === deslindeVigente.id_deslinde ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={tituloEditado}
                        onChange={(e) => setTituloEditado(e.target.value)}
                      />
                    </td>
                    <td>
                      <textarea
                        value={contenidoEditado}
                        onChange={(e) => setContenidoEditado(e.target.value)}
                      />
                    </td>
                    <td>{new Date(deslindeVigente.fecha_creacion).toLocaleDateString()}</td>
                    <td>
                      <button className="admin-politicas-boton admin-politicas-boton-editar" onClick={() => handleActualizar(deslindeVigente.id_deslinde)}>Guardar</button>
                      <button className="admin-politicas-boton admin-politicas-boton-cancelar" onClick={handleCancelarEdicion}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{deslindeVigente.titulo}</td>
                    <td>{deslindeVigente.contenido}</td>
                    <td>{new Date(deslindeVigente.fecha_creacion).toLocaleDateString()}</td>
                    <td>
                      <button className="admin-politicas-boton admin-politicas-boton-editar" onClick={() => handleEditarClick(deslindeVigente)}>Editar</button>
                      <button className="admin-politicas-boton admin-politicas-boton-eliminar" onClick={() => handleEliminar(deslindeVigente.id_deslinde)}>Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {deslindesAnteriores.length > 0 && (
        <div className="admin-politicas-anteriores">
          <h2>Deslindes Legales Anteriores</h2>
          <table className="admin-politicas-tabla">
            <thead>
              <tr>
                <th>Título</th>
                <th>Contenido</th>
                <th>Fecha Creación</th>
              </tr>
            </thead>
            <tbody>
              {deslindesAnteriores.map((deslinde) => (
                <tr key={deslinde.id_deslinde}>
                  <td>{deslinde.titulo}</td>
                  <td>{deslinde.contenido}</td>
                  <td>{new Date(deslinde.fecha_creacion).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDeslinde;
