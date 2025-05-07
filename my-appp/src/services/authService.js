import axios from 'axios';
import { API_ENDPOINTS } from '../utils/config';

/**
 * Serviço para gerenciar autenticação e operações relacionadas
 */
const authService = {
  /**
   * Realiza o login do usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} Resposta da API
   */
  login: async (email, password) => {
    try {
      // Log para diagnóstico
      console.log('Tentando fazer login com:', { email, url: API_ENDPOINTS.auth.login });

      // Verificar se há algum token anterior e remover para evitar conflitos
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      // Fazer a requisição de login
      const response = await axios.post(
        API_ENDPOINTS.auth.login, 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Resposta de login recebida:', { 
        status: response.status,
        statusText: response.statusText,
        hasToken: !!response.data.token
      });
      
      if (response.status === 200) {
        const token = response.data.token;
        
        // Armazena o token
        localStorage.setItem('token', token);
        
        // Define o header Authorization default para requisições
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Erro no serviço de login:', { 
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      throw error;
    }
  },
  
  /**
   * Realiza o registro de um novo usuário
   * @param {Object} userData - Dados do usuário a ser registrado
   * @returns {Promise} Resposta da API
   */
  register: async (userData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.auth.register, userData);
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de registro:', error);
      throw error;
    }
  },
  
  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} true se autenticado, false caso contrário
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },
  
  /**
   * Realiza o logout do usuário
   */
  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },
  
  /**
   * Obtém o token de autenticação
   * @returns {string|null} Token de autenticação ou null se não existir
   */
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  /**
   * Configura o token nos headers de requisição
   */
  setupAxiosInterceptors: () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Configurando interceptors do Axios com token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        console.log('Não há token para configurar interceptors');
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (error) {
      console.error('Erro ao configurar interceptors:', error);
    }
  }
};

export default authService; 