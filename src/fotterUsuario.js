import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FooterUsuario = () => {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50; // Ajuste de margen
      const isScrollable = document.body.offsetHeight > window.innerHeight; // Verifica si hay suficiente contenido para desplazarse
      setShowFooter(isAtBottom || !isScrollable); // Mostrar si está en la parte inferior o si no hay desplazamiento
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Llama la función al iniciar para establecer el estado inicial
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {showFooter && (
        <footer className="footer-usuario">
          <nav>
            <ul className="footer-nav">
              <li><Link to="/AvisoDePrivacidad">Aviso de Privacidad</Link></li>
              <li><Link to="/AvisoIntegral">Aviso Integral</Link></li>
              <li><Link to="/TerminosyCondiciones">Términos y Condiciones</Link></li>
              <li><Link to="/Mision">Misión</Link></li>
              <li><Link to="/Politicas">Políticas</Link></li>
            </ul>
          </nav>
        </footer>
      )}
    </>
  );
};

export default FooterUsuario;

// Estilos
const footerStyles = `
.footer-usuario {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #444;
  color: white;
  text-align: center;
  padding: 15px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.footer-nav {
  list-style-type: none;
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 0;
}

.footer-nav li {
  transition: color 0.3s;
}

.footer-nav li a {
  color: white; /* Color de texto por defecto */
  text-decoration: none; /* Sin subrayado */
  transition: color 0.3s;
}

.footer-nav li a:hover {
  color: #28a745; /* Color verde fuerte al hacer hover */
}

.footer-nav li a:active {
  color: #218838; /* Color verde fuerte al presionar */
}
`;

// Agrega los estilos al documento
const styleTag = document.createElement('style');
styleTag.innerHTML = footerStyles;
document.head.appendChild(styleTag);
