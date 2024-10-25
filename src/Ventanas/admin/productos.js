import React from 'react';
import './stylos_admin.css'; 

function Productos() {
  return (
    <div className="panel-productos">
      <h1 className="titulo-productos">Gestión de Productos</h1>
      <p className="descripcion-productos">Agregar, actualizar o eliminar productos del inventario.</p>
      <p className="descripcion-productos">(es estatico nada funciona)</p>

      <section className="seccion-agregar-productos">
        <h2 className="titulo-seccion-productos">Agregar Producto Nuevo</h2>
        <form className="formulario-productos">
          <label className="label-productos" htmlFor="nombre-producto">Nombre del Producto:</label>
          <input className="input-productos" type="text" id="nombre-producto" placeholder="Nombre del producto" />

          <label className="label-productos" htmlFor="precio-producto">Precio:</label>
          <input className="input-productos" type="number" id="precio-producto" placeholder="Precio" />

          <label className="label-productos" htmlFor="categoria-producto">Categoría:</label>
          <select className="input-productos" id="categoria-producto">
            <option value="Jabones">Jabones</option>
            <option value="Fabulosos">Fabulosos</option>
            <option value="Utencilios">Utencilios de limpieza</option>
          </select>

          <button className="boton-productos" type="submit">Agregar Producto</button>
        </form>
      </section>

      <section className="seccion-listado-productos">
        <h2 className="titulo-seccion-productos">Listado de Productos</h2>
        <table className="tabla-productos">
          <thead>
            <tr>
              <th className="celda-productos">Producto</th>
              <th className="celda-productos">Precio</th>
              <th className="celda-productos">Categoría</th>
              <th className="celda-productos">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="celda-productos">Jabon liquido Lavanda 1L</td>
              <td className="celda-productos">$20.00</td>
              <td className="celda-productos">Jabones</td>
              <td className="celda-productos">
                <button className="boton-accion-productos">Editar</button>
                <button className="boton-accion-productos">Eliminar</button>
              </td>
            </tr>
            {/* Aquí se pueden agregar más productos estáticos */}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Productos;
