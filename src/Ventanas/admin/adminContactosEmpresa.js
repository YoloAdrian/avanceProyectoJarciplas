import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './stylos_admin.css'; // Asegúrate de importar los estilos

function AdminContactosEmpresa() {
  const [informacion, setInformacion] = useState({});
  const [contactos, setContactos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [eslogan, setEslogan] = useState('');
  const [logo, setLogo] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [nuevoContacto, setNuevoContacto] = useState({ nombre: '', informacion: '' });
  const [editMode, setEditMode] = useState(false);

  const obtenerInformacion = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/informacion');
      const data = response.data[0];
      setInformacion(data);
      setNombre(data.nombre);
      setEslogan(data.eslogan);
      const logoResponse = await axios.get(`http://localhost:3001/api/informacion/logo/${data.id_informacion}`, {
        responseType: 'blob',
      });
      const imageUrl = URL.createObjectURL(logoResponse.data);
      setLogo(imageUrl);
    } catch (error) {
      console.error('Error al obtener la información de la empresa', error);
    }
  };

  const obtenerContactos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/contactos');
      setContactos(response.data);
    } catch (error) {
      console.error('Error al obtener los contactos', error);
    }
  };

  useEffect(() => {
    obtenerInformacion();
    obtenerContactos();
  }, []);

  const actualizarInformacion = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (nombre !== informacion.nombre) formData.append('nombre', nombre);
    if (eslogan !== informacion.eslogan) formData.append('eslogan', eslogan);
    if (logo && typeof logo !== 'string') formData.append('logo', logo);

    try {
      await axios.put(`http://localhost:3001/api/informacion/${informacion.id_informacion}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Información actualizada correctamente');
      setEditMode(false);
      obtenerInformacion();
    } catch (error) {
      console.error('Error al actualizar la información', error);
    }
  };

  const crearContacto = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/contacto', nuevoContacto);
      alert('Contacto creado correctamente');
      setNuevoContacto({ nombre: '', informacion: '' });
      obtenerContactos();
    } catch (error) {
      console.error('Error al crear el contacto', error);
    }
  };

  const borrarContacto = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/contacto/${id}`);
      alert('Contacto eliminado correctamente');
      obtenerContactos();
    } catch (error) {
      console.error('Error al eliminar el contacto', error);
    }
  };

  const actualizarContacto = async (e) => {
    e.preventDefault();
    if (!selectedContact) return;

    try {
      await axios.put(`http://localhost:3001/api/contacto/${selectedContact.id_contacto}`, {
        nombre: selectedContact.nombre,
        informacion: selectedContact.informacion,
      });
      alert('Contacto actualizado correctamente');
      setSelectedContact(null);
      obtenerContactos();
    } catch (error) {
      console.error('Error al actualizar el contacto', error);
    }
  };

  return (
    <div className="admin-politicas-contenedor">
      <h2>Información de la Empresa</h2>
      <div>
        <p><strong>Nombre:</strong> {informacion.nombre}</p>
        <p><strong>Eslogan:</strong> {informacion.eslogan}</p>
        {logo && <img src={logo} alt="Logo" style={{ width: '30%', height: '25%' }} />}
        <div>
        {!editMode && (
          <button className="admin-politicas-boton admin-politicas-boton-editar" onClick={() => setEditMode(true)}>Editar Información</button>
        )}
        </div>
      </div>

      {editMode && (
        <form className="campos_contactos" onSubmit={actualizarInformacion}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              className="imput_crud"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <label>Eslogan:</label>
            <input
              type="text"
              className="imput_crud"
              value={eslogan}
              onChange={(e) => setEslogan(e.target.value)}
            />
          </div>
          <div>
            <label>Logo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
            />
          </div>
          <button className="admin-politicas-boton admin-politicas-boton-editar" type="submit">Actualizar Información</button>
          <button className="admin-politicas-boton admin-politicas-boton-cancelar" type="button" onClick={() => setEditMode(false)}>Cancelar</button>
        </form>
      )}

      <h2>Contactos</h2>
      <form className="campos_contactos" onSubmit={crearContacto}>
        <div className="admin-politicas-formulario">
          <label>Nombre de Contacto:</label>
          <input
            type="text"
            className='imput_crud'
            value={nuevoContacto.nombre}
            onChange={(e) => setNuevoContacto({ ...nuevoContacto, nombre: e.target.value })}
            required
          />
        </div>
        <div className="admin-politicas-formulario">
          <label>Información:</label>
          <input
            type="text"
            className="imput_crud"
            value={nuevoContacto.informacion}
            onChange={(e) => setNuevoContacto({ ...nuevoContacto, informacion: e.target.value })}
            required
          />
        </div>
        <button className="admin-politicas-boton-crear"  type="submit">Crear Nuevo Contacto</button>
      </form>

      <h3>Lista de Contactos</h3>
      <table className="admin-politicas-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Información</th>
            <th>Opciones</th>
          </tr>
        </thead>
              <tbody>
        {contactos.map((contacto) => (
          <tr key={contacto.id_contacto}>
            <td>
              {selectedContact && selectedContact.id_contacto === contacto.id_contacto ? (
                <input
                  type="text"
                  className="imput_crud"
                  value={selectedContact.nombre}
                  onChange={(e) =>
                    setSelectedContact({ ...selectedContact, nombre: e.target.value })
                  }
                  required
                />
              ) : (
                contacto.nombre
              )}
            </td>
            <td>
              {selectedContact && selectedContact.id_contacto === contacto.id_contacto ? (
                <input
                  type="text"
                  className="imput_crud"
                  value={selectedContact.informacion}
                  onChange={(e) =>
                    setSelectedContact({ ...selectedContact, informacion: e.target.value })
                  }
                  required
                />
              ) : (
                contacto.informacion
              )}
            </td>
            <td>
              {selectedContact && selectedContact.id_contacto === contacto.id_contacto ? (
                <>
                  <button
                    className="admin-politicas-boton admin-politicas-boton-editar"
                    onClick={actualizarContacto}
                  >
                    Actualizar
                  </button>
                  <button
                    className="admin-politicas-boton admin-politicas-boton-cancelar"
                    onClick={() => setSelectedContact(null)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="admin-politicas-boton admin-politicas-boton-editar"
                    onClick={() => setSelectedContact(contacto)}
                  >
                    Editar
                  </button>
                  <button
                    className="admin-politicas-boton admin-politicas-boton-eliminar"
                    onClick={() => borrarContacto(contacto.id_contacto)}
                  >
                    Eliminar
                  </button>
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

export default AdminContactosEmpresa;
