import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Importando o App que contém suas rotas   
import './styles/Index.css';  // Importando o estilo global

// Configurando interceptors do Axios
import { authService } from './services';

// Configura o token nos headers se o usuário estiver autenticado
authService.setupAxiosInterceptors();

const root = ReactDOM.createRoot(document.getElementById('root'));  // Elemento com id "root" no index.html
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
