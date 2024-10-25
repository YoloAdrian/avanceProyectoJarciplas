import React, { useEffect, useState } from 'react';
import './stylos_admin.css';

function AdminTerminos() {
  const [terminos, setTerminos] = useState([]);
  const [editandoTermino, setEditandoTermino] = useState(null);
  const [tituloEditado, setTituloEditado] = useState('');
  const [contenidoEditado, setContenidoEditado] = useState('');
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoContenido, setNuevoContenido] = useState('');

  useEffect(() => {
    obtenerTerminos();
  }, []);

  const obtenerTerminos = async () => {
    try {
      const response = await fetch('https://backendjarciplas.onrender.com/api/terminos');
      const data = await response.json();
      setTerminos(data);
    } catch (error) {
      console.error('Error al obtener los términos:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`https://backendjarciplas.onrender.com/api/terminos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        obtenerTerminos();
      } else {
        const errorData = await response.json();
        console.error('Error al eliminar el término:', errorData);
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
    }
  };

  const handleActualizar = async (id) => {
    const terminoActualizado = {
      titulo: tituloEditado,
      contenido: contenidoEditado,
    };

    const response = await fetch(`https://backendjarciplas.onrender.com/api/terminos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(terminoActualizado),
    });

    if (response.ok) {
      obtenerTerminos();
      setEditandoTermino(null);
    } else {
      const errorData = await response.json();
      console.error('Error al actualizar el término:', errorData);
    }
  };

  const handleCrear = async () => {
    const newTermino = {
      titulo: nuevoTitulo,
      contenido: nuevoContenido,
      fecha_vigencia: new Date().toISOString().split('T')[0],
    };

    const response = await fetch('https://backendjarciplas.onrender.com/api/terminos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTermino),
    });

    if (response.ok) {
      obtenerTerminos();
      setNuevoTitulo('');
      setNuevoContenido('');
    } else {
      const errorData = await response.json();
      console.error('Error al crear el término:', errorData);
    }
  };

  const handleEditarClick = (termino) => {
    setEditandoTermino(termino.id_terminos);
    setTituloEditado(termino.titulo);
    setContenidoEditado(termino.contenido);
  };

  const handleCancelarEdicion = () => {
    setEditandoTermino(null);
    setTituloEditado('');
    setContenidoEditado('');
  };

  const terminoVigente = terminos.find(termino => termino.estado === 'vigente');
  const terminosAnteriores = terminos.filter(termino => termino.estado !== 'vigente');

  return (
    <div className="admin-politicas-contenedor">
      <div className="admin-politicas-formulario">
        <h2>Crear Nuevo Término</h2>
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
        <button className="admin-politicas-boton-crear" onClick={handleCrear}>Crear Término</button>
      </div>

      {terminoVigente && (
        <div className="admin-politicas-vigente">
          <h2>Término Vigente</h2>
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
              <tr key={terminoVigente.id_terminos}>
                {editandoTermino === terminoVigente.id_terminos ? (
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
                    <td>{new Date(terminoVigente.fecha_creacion).toLocaleDateString()}</td>
                    <td>{terminoVigente.version}</td>
                    <td>
                      <button className="admin-politicas-boton admin-politicas-boton-editar" onClick={() => handleActualizar(terminoVigente.id_terminos)}>Guardar</button>
                      <button className="admin-politicas-boton admin-politicas-boton-cancelar" onClick={handleCancelarEdicion}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{terminoVigente.titulo}</td>
                    <td>{terminoVigente.contenido}</td>
                    <td>{new Date(terminoVigente.fecha_creacion).toLocaleDateString()}</td>
                    <td>{terminoVigente.version}</td>
                    <td>
                      <button className="admin-politicas-boton admin-politicas-boton-editar" onClick={() => handleEditarClick(terminoVigente)}>Editar</button>
                      <button className="admin-politicas-boton admin-politicas-boton-eliminar" onClick={() => handleEliminar(terminoVigente.id_terminos)}>Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {terminosAnteriores.length > 0 && (
        <div className="admin-politicas-anteriores">
          <h2>Términos Anteriores</h2>
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
              {terminosAnteriores.map((termino) => (
                <tr key={termino.id_terminos}>
                  <td>{termino.titulo}</td>
                  <td>{termino.contenido}</td>
                  <td>{new Date(termino.fecha_creacion).toLocaleDateString()}</td>
                  <td>{termino.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminTerminos;
