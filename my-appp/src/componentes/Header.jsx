import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const handleNavigation = (path) => {
    setMenuAberto(false); // Fecha o menu ao navegar
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMenuAberto(false); // Fecha o menu ao fazer logout
    navigate("/login");
  };


  // Fecha o menu quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuAberto && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuAberto]);

  
  
  return (
    <>
      <header className="header-menu">
      {/* O parágrafo só será exibido se o menu não estiver aberto */}
     
      <button className="menu-hamburguer" onClick={toggleMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3">
          <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
        </svg>
      </button>
      </header>

      {menuAberto && (
        <nav className="menu" ref={menuRef}>
          {/* Botão para fechar o menu */}
           <button className="menu-close" onClick={toggleMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
          <path d="M313-440l224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
        </svg>
      </button>
          <ul>
            <li onClick={() => handleNavigation("/entregues")}>Entregues</li>
            <li onClick={() => handleNavigation("/inicio")}>Início</li>
            <li onClick={() => handleNavigation("/prefixo")}>Prefixo</li>
            <li onClick={() => handleNavigation("/item")}>Item</li>
            <li onClick={() => handleNavigation("/relatorio")}>Relatorio</li>
          </ul>
          {/* Botão de Log Out */}
          <div className="logout-container">
            <button className="logout-button" onClick={handleLogout}>
              <span className="logout-icon" role="img" aria-label="logout"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg></span>
              Sair
            </button>
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
