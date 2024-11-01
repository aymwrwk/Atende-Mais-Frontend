import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Importando o App que contém suas rotas
import './componentes/Index.css';  // Importando o estilo global

const root = ReactDOM.createRoot(document.getElementById('root'));  // Elemento com id "root" no index.html
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
