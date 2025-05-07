/**
 * Configuração centralizada da aplicação
 * Contém constantes e configurações utilizadas em toda a aplicação
 */

// URL base da API
export const API_BASE_URL = 'https://atende-mais.shop:8080/api/v1';

// Endpoints da API
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/registrar-estabelecimento`
  },
  report: {
    getReport: `${API_BASE_URL}/relatorio/getRelatorio`
  },
  orders: {
    notifications: `${API_BASE_URL}/pedido/notificacoes`
  }
};

// Configurações de tempo (em milissegundos)
export const TIME_CONFIG = {
  messageTimeout: 4000, // Tempo para mensagens desaparecerem
  refreshInterval: 30000 // Intervalo para atualização automática de dados
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  TIME_CONFIG
}; 