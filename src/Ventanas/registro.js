import React, { useState } from 'react';
import './stylos.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; 

const Registro = () => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    edad: '',
    genero: '',
    correo: '',
    telefono: '',
    contraseña: '',
    confirmar_contraseña: '',
  });

  const [errorContraseña, setErrorContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarConfirmarContraseña, setMostrarConfirmarContraseña] = useState(false);
  const [fuerzaContraseña, setFuerzaContraseña] = useState(0);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });

    // Evaluar la fuerza de la contraseña
    if (name === 'contraseña') {
      const fuerza = evaluarFuerzaContraseña(value);
      setFuerzaContraseña(fuerza);
    }
  };

  const evaluarFuerzaContraseña = (contraseña) => {
    let fuerza = 0;
    if (contraseña.length >= 12 && contraseña.length < 14) fuerza = 1; 
    if (contraseña.length >= 14 && contraseña.length < 18) fuerza = 2; 
    if (contraseña.length >= 18 && /^[A-Za-z0-9]*$/.test(contraseña)) fuerza = 3; 
    if (contraseña.length >= 18 && /[^A-Za-z0-9]/.test(contraseña)) fuerza = 4; 
    return fuerza;
  };

  const manejarGuardar = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formulario.contraseña !== formulario.confirmar_contraseña) {
      setErrorContraseña('Las contraseñas no coinciden');
      return;
    }

    setErrorContraseña('');
    
    // Preparar los datos para enviar al backend
    const datosUsuario = {
      Nombre: formulario.nombre,
      Apellido_Paterno: formulario.apellido_paterno,
      Apellido_Materno: formulario.apellido_materno,
      Edad: formulario.edad,
      Genero: formulario.genero,
      Correo: formulario.correo,
      Telefono: formulario.telefono,
      Contraseña: formulario.contraseña,
    };

    try {
      const respuesta = await fetch('http://localhost:3001/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario),
      });

      if (!respuesta.ok) {
        throw new Error('Error al guardar el usuario');
      }

      const nuevoUsuario = await respuesta.json();
      console.log('Usuario guardado:', nuevoUsuario);

      // Limpiar el formulario después de guardar
      setFormulario({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        edad: '',
        genero: '',
        correo: '',
        telefono: '',
        contraseña: '',
        confirmar_contraseña: '',
      });
      setFuerzaContraseña(0); // Limpiar la barra de fuerza de contraseña
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setErrorContraseña('Error al guardar el usuario. Intente de nuevo.');
    }
  };

  const manejarCancelar = () => {
    setFormulario({
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      edad: '',
      genero: '',
      correo: '',
      telefono: '',
      contraseña: '',
      confirmar_contraseña: '',
    });
    setErrorContraseña('');
    setFuerzaContraseña(0); 
  };

  return (
    <form className="formulario-usuario" onSubmit={manejarGuardar} autoComplete="off">
      <div className="formulario-campo">
        <label>Nombre:</label>
        <input
          className="input-texto"
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={manejarCambio}
          required
          minLength="3"
          maxLength="60"
        />
      </div>

      <div className="formulario-campo">
        <label>Apellido Paterno:</label>
        <input
          className="input-texto"
          type="text"
          name="apellido_paterno"
          value={formulario.apellido_paterno}
          onChange={manejarCambio}
          required
          minLength="3"
          maxLength="60"
        />
      </div>

      <div className="formulario-campo">
        <label>Apellido Materno:</label>
        <input
          className="input-texto"
          type="text"
          name="apellido_materno"
          value={formulario.apellido_materno}
          onChange={manejarCambio}
          required
          minLength="3"
          maxLength="60"
        />
      </div>

      <div className="formulario-campo">
        <label>Edad:</label>
        <input
          className="input-texto"
          type="number"
          name="edad"
          value={formulario.edad}
          onChange={manejarCambio}
          required
          min="18"
          max="100"
        />
      </div>

      <div className="formulario-campo">
        <label>Género:</label>
        <select
          className="input-select"
          name="genero"
          value={formulario.genero}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccione una opción</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="formulario-campo">
        <label>Correo:</label>
        <input
          className="input-texto"
          type="email"
          name="correo"
          value={formulario.correo}
          onChange={manejarCambio}
          required
          minLength="15"
          maxLength="60"
        />
      </div>

      <div className="formulario-campo">
        <label>Teléfono:</label>
        <input
          className="input-texto"
          type="tel"
          name="telefono"
          value={formulario.telefono}
          onChange={manejarCambio}
          required
          minLength="7"
          maxLength="10"
        />
      </div>

      <div className="formulario-campo">
        <label>Contraseña:</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            className="input-contraseña" 
            type={mostrarContraseña ? 'text' : 'password'}
            name="contraseña"
            value={formulario.contraseña}
            onChange={manejarCambio}
            required
            minLength="12"
          />
          <button 
            type="button" 
            className="btn-mostrar" 
            onClick={() => setMostrarContraseña(!mostrarContraseña)}
            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
          >
            {mostrarContraseña ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>
      </div>

      <div className="formulario-campo">
        <label>Confirmar Contraseña:</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            className="input-contraseña" 
            type={mostrarConfirmarContraseña ? 'text' : 'password'}
            name="confirmar_contraseña"
            value={formulario.confirmar_contraseña}
            onChange={manejarCambio}
            required
            minLength="12"
            maxLength="18"
          />
          <button 
            type="button" 
            className="btn-mostrar" 
            onClick={() => setMostrarConfirmarContraseña(!mostrarConfirmarContraseña)}
            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
          >
            {mostrarConfirmarContraseña ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>
      </div>

      {/* Barra de fuerza de la contraseña */}
      <div className="barra-fuerza" style={{ width: `${fuerzaContraseña * 20}%`, backgroundColor: 'green' }}></div>
      {fuerzaContraseña === 0 && <p className="error">Contraseña muy débil</p>}
      {fuerzaContraseña === 1 && <p>Contraseña débil</p>}
      {fuerzaContraseña === 2 && <p>Contraseña media</p>}
      {fuerzaContraseña === 3 && <p>Contraseña fuerte</p>}
      {fuerzaContraseña === 4 && <p>Contraseña muy fuerte</p>}

      {errorContraseña && <p className="error">{errorContraseña}</p>}

      <div className="formulario-botones">
        <button type="submit" className="btn">Guardar</button>
        <button type="button" className="btn" onClick={manejarCancelar}>Cancelar</button>
      </div>
    </form>
  );
};

export default Registro;

