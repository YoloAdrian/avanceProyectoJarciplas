import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminBloqueos() {
  const [usuariosBloqueados, setUsuariosBloqueados] = useState([]);
  const [trabajadoresBloqueados, setTrabajadoresBloqueados] = useState([]);
  const [filtro, setFiltro] = useState('todos'); // Valor por defecto: todos

  // Función para obtener usuarios bloqueados según el filtro
  const obtenerUsuariosBloqueados = async () => {
    let endpoint = 'https://backendjarciplas.onrender.com/api/frecuencia_bloqueos_usuarios';
    switch (filtro) {
      case 'dia':
        endpoint += '/ultimo_dia';
        break;
      case 'semana':
        endpoint += '/ultima_semana';
        break;
      case 'mes':
        endpoint += '/ultimo_mes';
        break;
      case 'todos':
      default:
        break;
    }

    try {
      const response = await axios.get(endpoint);
      setUsuariosBloqueados(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios bloqueados:', error);
    }
  };

  // Función para obtener trabajadores bloqueados según el filtro
  const obtenerTrabajadoresBloqueados = async () => {
    let endpoint = 'https://backendjarciplas.onrender.com/api/frecuencia_bloqueos_trabajadores';
    switch (filtro) {
      case 'dia':
        endpoint += '/ultimo_dia';
        break;
      case 'semana':
        endpoint += '/ultima_semana';
        break;
      case 'mes':
        endpoint += '/ultimo_mes';
        break;
      case 'todos':
      default:
        break;
    }

    try {
      const response = await axios.get(endpoint);
      setTrabajadoresBloqueados(response.data);
    } catch (error) {
      console.error('Error al obtener trabajadores bloqueados:', error);
    }
  };

  // Llamadas a la API cada vez que cambie el filtro
  useEffect(() => {
    obtenerUsuariosBloqueados();
    obtenerTrabajadoresBloqueados();
  }, [filtro]);

  return (
    <div className="admin-bloqueos">
      <h2>Administración de Bloqueos</h2>

      {/* Selector de filtro */}
      <div className="filtros">
        <label>
          <input
            type="radio"
            name="filtro"
            value="dia"
            checked={filtro === 'dia'}
            onChange={() => setFiltro('dia')}
          />
          Último día
        </label>
        <label>
          <input
            type="radio"
            name="filtro"
            value="semana"
            checked={filtro === 'semana'}
            onChange={() => setFiltro('semana')}
          />
          Última semana
        </label>
        <label>
          <input
            type="radio"
            name="filtro"
            value="mes"
            checked={filtro === 'mes'}
            onChange={() => setFiltro('mes')}
          />
          Último mes
        </label>
        <label>
          <input
            type="radio"
            name="filtro"
            value="todos"
            checked={filtro === 'todos'}
            onChange={() => setFiltro('todos')}
          />
          Ver todos
        </label>
      </div>

      {/* Listado de usuarios bloqueados */}
      <div className="lista-usuarios">
        <h3>Usuarios Bloqueados</h3>
        <ul>
          {usuariosBloqueados.map((usuario) => (
            <li key={usuario.id_usuario}>
              Usuario ID: {usuario.id_usuario} - Fecha: {new Date(usuario.fecha).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Listado de trabajadores bloqueados */}
      <div className="lista-trabajadores">
        <h3>Trabajadores Bloqueados</h3>
        <ul>
          {trabajadoresBloqueados.map((trabajador) => (
            <li key={trabajador.id_trabajador}>
              Trabajador ID: {trabajador.id_trabajador} - Fecha: {new Date(trabajador.fecha).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminBloqueos;
