// CambiarTema.js
import React from 'react';
import { useTema } from './contextoTema';

const CambiarTema = () => {
  const { tema, cambiarTema } = useTema();

  return (
    <button onClick={cambiarTema} style={{ margin: '10px' }}>
      Cambiar a tema {tema === 'light' ? 'oscuro' : 'claro'}
    </button>
  );
};

export default CambiarTema;
