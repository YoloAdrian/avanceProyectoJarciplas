import React from 'react';
import './stylos.css'; // Archivo de estilos personalizados

function Administrador() {
  return (
    <div className="panel-administrador">
      <h1 className="titulo-administrador">Bienvenido al Panel de Administrador</h1>
      <p className="descripcion-administrador">Este es el centro de control para administrar y configurar todos los aspectos importantes de la aplicación.</p>

      <section className="introduccion-administrador">
        <h2 className="titulo-seccion-administrador">Acceso rápido a herramientas clave</h2>
        <p className="texto-administrador">Aquí podrás gestionar usuarios, configurar opciones de seguridad, y revisar algunos aspectos de la aplicación.</p>
        <p className="texto-administrador">Recuerda que cualquier cambio realizado aquí impactará a todos los usuarios y la operación general de la aplicación, ¡así que asegúrate de revisar cada modificación cuidadosamente!</p>
      </section>

      <section className="informacion-administrador">
        <h2 className="titulo-seccion-administrador">¿Necesitas ayuda?</h2>
        <p className="texto-administrador">Si tienes alguna duda sobre el funcionamiento del panel de administrador, ponte en contacto con los desarrolladores</p>
      </section>
    </div>
  );
}

export default Administrador;



