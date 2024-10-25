import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Ventanas/AuthContext';

const FooterUsuario = () => {
  const { usuario } = useAuth();
  const [showFooter, setShowFooter] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      const isScrollable = document.body.offsetHeight > window.innerHeight;
      setShowFooter(isAtBottom || !isScrollable);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll();
    handleResize();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (usuario === 'admin') {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="contenido-principal">
        {/* Aquí va el contenido principal de la página */}
      </div>

      {showFooter && (
        <footer className="footer-usuario">
          <nav>
            {isSmallScreen && (
              <button className="menu-toggle" onClick={toggleMenu}>
                 ⬆
              </button>
            )}
            <ul className={`footer-nav ${isSmallScreen && !isMenuOpen ? 'nav-oculto' : ''}`}>
              <li><Link to="/Contacto">Contacto</Link></li>
              <li><Link to="/Deslinde">Deslinde</Link></li>
              <li><Link to="/Terminos">Términos y Condiciones</Link></li>
              <li><Link to="/Politicas">Políticas</Link></li>
            </ul>
          </nav>
        </footer>
      )}

      <style jsx>{`
        .contenido-principal {
          margin-bottom: 80px;
        }

        .footer-usuario {
          position: fixed;
          left: 0;
          bottom: 0;
          width: 100%;
          background-color: #000000;
          color: white;
          text-align: center;
          padding: 20px 0;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }

        .footer-nav {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
        }

        .footer-nav.nav-oculto {
          display: none; /* Solo oculta la lista cuando el menú está cerrado */
        }

        .footer-nav li {
          margin: 0 15px;
        }

        .footer-nav li a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .footer-nav li a:hover {
          color: #28a745;
        }

        .footer-nav li a:active {
          color: #218838;
        }

        .menu-toggle {
          background-color: transparent;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          margin-bottom: 10px;
        }

        @media (max-width: 768px) {
          .footer-nav {
            flex-direction: column;
          }

          .footer-nav li {
            margin: 10px 0;
          }
        }
      `}</style>
    </>
  );
};

export default FooterUsuario;

