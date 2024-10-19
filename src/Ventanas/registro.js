import React, { useState } from 'react';
import './stylos.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; 
import sha1 from 'sha1'; // Asegúrate de instalar esta librería

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



  const [errores, setErrores] = useState({});
  const [errorContraseña, setErrorContraseña] = useState('');
  const [errorInput, setErrorInput] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarConfirmarContraseña, setMostrarConfirmarContraseña] = useState(false);
  const [fuerzaContraseña, setFuerzaContraseña] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState('');
  const [mensajeContraseña, setMensajeContraseña] = useState('');



  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });

    if (name === 'contraseña') {
      const fuerza = evaluarFuerzaContraseña(value);
      setFuerzaContraseña(fuerza);


      
      // Actualizar mensaje de contraseña
      if (fuerza === 0) {
        setMensajeContraseña('Contraseña muy débil. Evita patrones comunes o secuencias.');
      } else if (fuerza <= 2) {
        setMensajeContraseña('Contraseña débil.');
      } else if (fuerza === 3) {
        setMensajeContraseña('Contraseña moderada.');
      } else if (fuerza === 4) {
        setMensajeContraseña('Contraseña fuerte.');
      }
    }

    if (name !== 'genero' && !validarEntrada(name, value)) {
      setErrores({ ...errores, [name]: `El formato no coincide, verifique sus datos` });
    } else {
      const nuevosErrores = { ...errores };
      delete nuevosErrores[name];
      setErrores(nuevosErrores);
    }

    // Validar que el campo de género tenga un valor seleccionado
    if (name === 'genero') {
      if (value === '') {
        setErrores((prev) => ({ ...prev, genero: 'Por favor, seleccione un género.' }));
      } else {
        const nuevosErrores = { ...errores };
        delete nuevosErrores.genero;
        setErrores(nuevosErrores);
      }
    }
  };

  

  const validarEntrada = (campo, valor) => {
    const regexValidos = {
      nombre: /^[a-zA-ZÀ-ÿ\s]+$/,
      apellido_paterno: /^[a-zA-ZÀ-ÿ\s]+$/,
      apellido_materno: /^[a-zA-ZÀ-ÿ\s]+$/,
      correo: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      telefono: /^[0-9]{10}$/, 
      edad: /^[0-9]+$/, 
      contraseña: /^[\w@#%&*+=-]{8,20}$/,
      confirmar_contraseña: /^[\w@#%&*+=-]{8,20}$/,
    };

    return regexValidos[campo]?.test(valor);
  };

  const validarCampo = (nombre, valor) => {
    let erroresActualizados = { ...errores };
  
    if (nombre === 'nombre' || nombre === 'apellido_paterno' || nombre === 'apellido_materno') {
      if (!/^[a-zA-Z\s]+$/.test(valor)) {
        erroresActualizados[nombre] = 'Solo se permiten letras.';
      } else {
        delete erroresActualizados[nombre];
      }
    }
  
    if (nombre === 'telefono') {
      if (!/^\d+$/.test(valor)) {
        erroresActualizados[nombre] = 'Solo se permiten números.';
      } else {
        delete erroresActualizados[nombre];
      }
    }
  
    setErrores(erroresActualizados);
  };

  

  const evaluarFuerzaContraseña = (contraseña) => {
    let fuerza = 0;

    
    const patronesComunes = ['12345', 'password', 'abcdef', 'qwerty'];
    const tienePatronComun = patronesComunes.some((patron) =>
      contraseña.toLowerCase().includes(patron)
    );

    if (tienePatronComun) return 0;

    // Verificar secuencias prohibidas
    if (contieneSecuencia(contraseña)) return 0;

    // Verificar longitud mínima
    if (contraseña.length >= 12) fuerza += 1;

    // Verificar complejidad
    if (/[A-Z]/.test(contraseña)) fuerza += 1; 
    if (/[a-z]/.test(contraseña)) fuerza += 1;
    if (/\d/.test(contraseña)) fuerza += 1;
    if (/[^A-Za-z0-9]/.test(contraseña)) fuerza += 1; 

    return fuerza;
  };

  const contieneSecuencia = (contraseña) => {
    
    const secuenciasAlfabeticas = [
      'abcdefghijklmnopqrstuvwxyz',
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '0123456789'
    ];

    for (let i = 0; i < secuenciasAlfabeticas.length; i++) {
      for (let j = 0; j < secuenciasAlfabeticas[i].length - 2; j++) {
        const secuencia = secuenciasAlfabeticas[i].slice(j, j + 3);
        if (contraseña.includes(secuencia) || contraseña.includes(secuencia.split('').reverse().join(''))) {
          return true; 
        }
      }
    }

    return false; 
  };

  const verificarContraseñaFiltrada = async (contraseña) => {
    const hashContraseña = sha1(contraseña); 
    const prefix = hashContraseña.slice(0, 5); 
    const suffix = hashContraseña.slice(5); 

    try {
      const respuesta = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const textoRespuesta = await respuesta.text();
      const haSidoFiltrada = textoRespuesta.split('\n').some((linea) => {
        const [hashSuffix] = linea.split(':');
        return hashSuffix.toLowerCase() === suffix.toLowerCase();
      });

      return haSidoFiltrada;
    } catch (error) {
      console.error('Error al verificar contraseña filtrada:', error);
      return false;
    }
  };

  

  const manejarGuardar = async (e) => {
    e.preventDefault();

    if (Object.keys(errores).length > 0) {
      // Construir un mensaje con los errores
      const mensajesErrores = Object.entries(errores)
          .map(([campo, mensaje]) => `${campo}: ${mensaje}`)
          .join('\n');
  
      setModalMensaje(`Error: algunos campos son incorrectos`);
      setModalVisible(true);
      return;
  }
  
    if (formulario.contraseña !== formulario.confirmar_contraseña) {
      setErrorContraseña('Las contraseñas no coinciden');
      return;
    }
  
    const haSidoFiltrada = await verificarContraseñaFiltrada(formulario.contraseña);
    if (haSidoFiltrada) {
      setErrorContraseña('Esta contraseña no es segura. Elige otra.');
      return;
    }
  
    setErrorContraseña('');
  
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
      setModalMensaje('Usuario guardado exitosamente.');
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setModalMensaje('Error al guardar el usuario. Intente de nuevo.');
    } finally {
      setModalVisible(true); // Mostrar el modal
    }
  
    // Restablecer el formulario
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
    setFuerzaContraseña(0);
    setMensajeContraseña('');
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

  const Modal = ({ visible, mensaje, onClose }) => {
    if (!visible) return null;
  
    return (
      <div className="modal">
        <div className="modal-contenido">
          <p>{mensaje}</p>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    );
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
        {errores.nombre && <p className="error_men">{errores.nombre}</p>}
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
          maxLength="30"
        />
        {errores.apellido_paterno && <p className="error_men">{errores.apellido_paterno}</p>}
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
          maxLength="30"
        />
        {errores.apellido_materno && <p className="error_men">{errores.apellido_materno}</p>}
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
          max="99"
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
          <option value="">Seleccionar</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
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
          pattern="[0-9]{10}"
        />
        {errores.telefono && <p className="error">{errores.telefono}</p>}
      </div>

      <div className="formulario-campo">
        <label>Contraseña:</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            className="input-pass"
            type={mostrarContraseña ? 'text' : 'password'}
            name="contraseña"
            value={formulario.contraseña}
            onChange={manejarCambio}
            required
            minLength="8"
            maxLength="20"
          />
          <button
            type="button"
            onClick={() => setMostrarContraseña(!mostrarContraseña)}
            className="boton-ver"
            style={{ marginLeft: '10px' }}
          >
            {mostrarContraseña ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>
        <p>{mensajeContraseña}</p>
        <div className={`barra-fuerza fuerza-${fuerzaContraseña}`} />
      </div>

      <div className="formulario-campo">
        <label>Confirmar Contraseña:</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            className="input-pass"
            type={mostrarConfirmarContraseña ? 'text' : 'password'}
            name="confirmar_contraseña"
            value={formulario.confirmar_contraseña}
            onChange={manejarCambio}
            required
            minLength="8"
            maxLength="20"
          />
          <button
            type="button"
            onClick={() => setMostrarConfirmarContraseña(!mostrarConfirmarContraseña)}
            className="boton-ver"
            style={{ marginLeft: '10px' }}
          >
            {mostrarConfirmarContraseña ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>
      </div>

      {errorContraseña && <p className="error">{errorContraseña}</p>}
      
      <div className="formulario-botones">
        <button type="submit" className="btn_guardar">Registrarse</button>
        <button type="button" className="btn_cancelar" onClick={manejarCancelar}>Cancelar</button>
        <Modal visible={modalVisible} mensaje={modalMensaje} onClose={() => setModalVisible(false)} />
      </div>
    </form>
  );
};

export default Registro;
