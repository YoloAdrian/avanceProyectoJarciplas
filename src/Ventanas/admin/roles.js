import React, { useEffect, useState } from 'react';
import './stylos_admin.css';

function Roles() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tipos, setTipos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trabajadoresResponse = await fetch('http://localhost:3001/api/trabajadores');
        const trabajadoresData = await trabajadoresResponse.json();
        setTrabajadores(trabajadoresData);

        const usuariosResponse = await fetch('http://localhost:3001/api/usuarios');
        const usuariosData = await usuariosResponse.json();
        setUsuarios(usuariosData);

        const tiposResponse = await fetch('http://localhost:3001/api/tipos_usuarios');
        const tiposData = await tiposResponse.json();

        const tiposMap = {};
        tiposData.forEach(tipo => {
          tiposMap[tipo.id_tipo_usuarios] = tipo.Usuario;
        });
        setTipos(tiposMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trabajadores, usuarios]);  // Dependencias agregadas para recargar cuando se actualicen trabajadores o usuarios.

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este trabajador? Esta acción es irreversible.")) {
      try {
        const response = await fetch(`http://localhost:3001/api/trabajadores/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setTrabajadores(trabajadores.filter(trabajador => trabajador.id_trabajador !== id));
        } else {
          const errorData = await response.json();
          console.error("Error al eliminar el trabajador:", errorData);
          alert("Error al eliminar el trabajador: " + errorData.message);
        }
      } catch (error) {
        console.error("Error eliminando trabajador:", error);
      }
    }
  };

  const handleChangeRole = async (id, nuevoTipoUsuario) => {
    if (nuevoTipoUsuario) {
      try {
        const response = await fetch(`http://localhost:3001/api/trabajadores/${id}/cambiar_rol`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nuevoTipoUsuario }),
        });

        if (response.ok) {
          const updatedTrabajador = await response.json();
          setTrabajadores(trabajadores.map(trabajador => trabajador.id_trabajador === id ? updatedTrabajador : trabajador));
        } else {
          const errorData = await response.json();
          console.error("Error cambiando el rol del trabajador:", errorData);
          alert("Error al cambiar el rol del trabajador: " + errorData.message);
        }
      } catch (error) {
        console.error("Error cambiando el rol del trabajador:", error);
      }
    } else {
      alert("Por favor, selecciona un nuevo rol.");
    }
  };

  const handleChangeUserRole = async (id, nuevoTipoUsuario) => {
    if (nuevoTipoUsuario) {
      try {
        const response = await fetch(`http://localhost:3001/api/usuarios/${id}/cambiar_rol`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nuevoTipoUsuario }),
        });

        if (response.ok) {
          const updatedUsuario = await response.json();
          setUsuarios(usuarios.filter(usuario => usuario.id_usuarios !== id));
          setTrabajadores(prevTrabajadores => [...prevTrabajadores, updatedUsuario]);  // Si pasa a ser trabajador, lo añadimos.
        } else {
          const errorData = await response.json();
          console.error("Error cambiando el rol del usuario:", errorData);
          alert("Error al cambiar el rol del usuario: " + errorData.message);
        }
      } catch (error) {
        console.error("Error cambiando el rol del usuario:", error);
      }
    } else {
      alert("Por favor, selecciona un nuevo rol.");
    }
  };

  return (
    <div className="roles-container">
    {loading ? (
      <p>Cargando...</p>
    ) : (
      <>
        <div className="roles-tabla">
          <h2 className="roles-header">Trabajadores</h2>
          <table className="roles-table trabajadores-table">
            <thead>
              <tr className="roles-row-header">
                <th className="roles-th">Datos</th>
                <th className="roles-th">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {trabajadores.map(trabajador => (
                <tr key={trabajador.id_trabajador} className="roles-row">
                  <td className="roles-td">
                    <p className="roles-paragraph">Nombre: {trabajador.Nombre}</p>
                    <p className="roles-paragraph">Apellido Paterno: {trabajador.Apellido_Paterno}</p>
                    <p className="roles-paragraph">Apellido Materno: {trabajador.Apellido_Materno}</p>
                    <p className="roles-paragraph">Correo: {trabajador.Correo}</p>
                    <p className="roles-paragraph">Teléfono: {trabajador.telefono}</p>
                    <p className="roles-paragraph">
                      Tipo Trabajador: {tipos[trabajador.id_tipo_trabajador] || trabajador.id_tipo_trabajador}
                    </p>
                  </td>
                  <td className="roles-options-cell">
                    <button 
                      className="roles-button" 
                      onClick={() => handleDelete(trabajador.id_trabajador)}
                    >
                      Borrar
                    </button>
                    <select 
                      className="roles_opciones" 
                      onChange={(e) => handleChangeRole(trabajador.id_trabajador, e.target.value)} 
                      defaultValue=""
                    >
                      <option value="" disabled>Cambiar Rol</option>
                      {Object.keys(tipos)
                        .filter(tipoId => tipoId !== String(trabajador.id_tipo_trabajador))
                        .map(tipoId => (
                          <option key={tipoId} value={tipoId}>
                            {tipos[tipoId]}
                          </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="roles-tabla">
          <h2 className="roles-header">Usuarios</h2>
          <table className="roles-table usuarios-table">
            <thead>
              <tr className="roles-row-header">
                <th className="roles-th">Datos</th>
                <th className="roles-th">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id_usuarios} className="roles-row">
                  <td className="roles-td">
                    <p className="roles-paragraph">Nombre: {usuario.Nombre}</p>
                    <p className="roles-paragraph">Apellido Paterno: {usuario.Apellido_Paterno}</p>
                    <p className="roles-paragraph">Apellido Materno: {usuario.Apellido_Materno}</p>
                    <p className="roles-paragraph">Correo: {usuario.Correo}</p>
                    <p className="roles-paragraph">Teléfono: {usuario.Telefono}</p>
                    <p className="roles-paragraph">
                      Tipo Usuario: {tipos[usuario.id_tipo_usuario] || usuario.id_tipo_usuario}
                    </p>
                  </td>
                  <td className="roles-options-cell">
                    <select 
                      className="roles_opciones" 
                      onChange={(e) => handleChangeUserRole(usuario.id_usuarios, e.target.value)} 
                      defaultValue=""
                    >
                      <option value="" disabled>Cambiar Rol</option>
                      {Object.keys(tipos)
                        .filter(tipoId => tipoId !== String(usuario.id_tipo_usuario))
                        .map(tipoId => (
                          <option key={tipoId} value={tipoId}>
                            {tipos[tipoId]}
                          </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )}
  </div>
  );
}

export default Roles;
