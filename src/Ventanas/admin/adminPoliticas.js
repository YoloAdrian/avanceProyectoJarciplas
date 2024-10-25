import React, { useEffect, useState } from 'react';
import './stylos_admin.css';

function AdminPoliticas() {
  const [politicas, setPoliticas] = useState([]);
  const [editandoPolitica, setEditandoPolitica] = useState(null);
  const [tituloEditado, setTituloEditado] = useState('');
  const [contenidoEditado, setContenidoEditado] = useState('');
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoContenido, setNuevoContenido] = useState('');

  useEffect(() => {
    obtenerPoliticas();
  }, []);

  const obtenerPoliticas = async () => {
    try {
      const response = await fetch('https://backendjarciplas.onrender.com/api/politicas');
      const data = await response.json();
      setPoliticas(data);
    } catch (error) {
      console.error('Error al obtener las políticas:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`https://backendjarciplas.onrender.com/api/politicas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        obtenerPoliticas();
      } else {
        const errorData = await response.json();
        console.error('Error al eliminar la política:', errorData);
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
    }
  };

  const handleActualizar = async (id) => {
    const politicaActualizada = {
      titulo: tituloEditado,
      contenido: contenidoEditado,
    };

    const response = await fetch(`https://backendjarciplas.onrender.com/api/politicas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(politicaActualizada),
    });

    if (response.ok) {
      obtenerPoliticas();
      setEditandoPolitica(null);
    } else {
      const errorData = await response.json();
      console.error('Error al actualizar la política:', errorData);
    }
  };

  const handleCrear = async () => {
    const newPolitica = {
      titulo: nuevoTitulo,
      contenido: nuevoContenido,
      // Obtener la fecha actual para fecha_vigencia
      fecha_vigencia: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    };

    const response = await fetch('https://backendjarciplas.onrender.com/api/politicas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPolitica),
    });

    if (response.ok) {
      obtenerPoliticas();
      setNuevoTitulo('');
      setNuevoContenido('');
    } else {
      const errorData = await response.json();
      console.error('Error al crear la política:', errorData);
    }
  };

  const handleEditarClick = (politica) => {
    setEditandoPolitica(politica.id_politica);
    setTituloEditado(politica.titulo);
    setContenidoEditado(politica.contenido);
  };

  const handleCancelarEdicion = () => {
    setEditandoPolitica(null);
    setTituloEditado('');
    setContenidoEditado('');
  };

  const politicaVigente = politicas.find(politica => politica.estado === 'vigente');
  const politicasAnteriores = politicas.filter(politica => politica.estado !== 'vigente');

  return (
    <div className="admin-politicas-contenedor">
      <div className="admin-politicas-formulario">
        <h2>Crear Nueva Política</h2>
        <input className='imput_crud'
          type="text"
          placeholder="Título"
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
        />
        <textarea className='imput_crud'
          placeholder="Contenido"
          value={nuevoContenido}
          onChange={(e) => setNuevoContenido(e.target.value)}
        />
        <button className="admin-politicas-boton-crear" onClick={handleCrear}>Crear Política</button>
      </div>

      {politicaVigente && (
        <div className="admin-politicas-vigente">
          <h2>Política Vigente</h2>
          <table className="admin-politicas-tabla">
            <thead>
              <tr>
                <th>Título</th>
                <th>Contenido</th>
                <th>Fecha Creación</th>
                <th>Versión</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              <tr key={politicaVigente.id_politica}>
                {editandoPolitica === politicaVigente.id_politica ? (
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
                    <td>{new Date(politicaVigente.fecha_creacion).toLocaleDateString()}</td>
                    <td>{politicaVigente.version}</td>
                    <td>
                      <button className="admin-politicas-boton admin-politicas-boton-editar" onClick={() => handleActualizar(politicaVigente.id_politica)}>Guardar</button>
                      <button className="admin-politicas-boton admin-politicas-boton-cancelar" onClick={handleCancelarEdicion}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{politicaVigente.titulo}</td>
                    <td>{politicaVigente.contenido}</td>
                    <td>{new Date(politicaVigente.fecha_creacion).toLocaleDateString()}</td>
                    <td>{politicaVigente.version}</td>
                    <td>
                      <button className="admin-politicas-boton admin-politicas-boton-editar" onClick={() => handleEditarClick(politicaVigente)}>Editar</button>
                      <button className="admin-politicas-boton admin-politicas-boton-eliminar" onClick={() => handleEliminar(politicaVigente.id_politica)}>Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {politicasAnteriores.length > 0 && (
        <div className="admin-politicas-anteriores">
          <h2>Políticas Anteriores</h2>
          <table className="admin-politicas-tabla">
            <thead>
              <tr>
                <th>Título</th>
                <th>Contenido</th>
                <th>Fecha Creación</th>
                <th>Versión</th>
              </tr>
            </thead>
            <tbody>
              {politicasAnteriores.map((politica) => (
                <tr key={politica.id_politica}>
                  <td>{politica.titulo}</td>
                  <td>{politica.contenido}</td>
                  <td>{new Date(politica.fecha_creacion).toLocaleDateString()}</td>
                  <td>{politica.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPoliticas;
