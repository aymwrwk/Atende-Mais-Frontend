/**
 * Utilitário para gerenciar erros da aplicação de forma padronizada
 */

/**
 * Extrai a mensagem de erro relevante dos diferentes tipos de erros
 * @param {Error|Object} error - O erro capturado
 * @returns {string} - Mensagem de erro amigável
 */
export const getErrorMessage = (error) => {
  if (!error) {
    return 'Ocorreu um erro desconhecido';
  }

  // Se for um erro de resposta do Axios
  if (error.response) {
    const { status, data } = error.response;
    
    // Mensagens de erro de acordo com o código HTTP
    switch (status) {
      case 400:
        return data.message || 'Requisição inválida';
      case 401:
        return 'Sessão expirada ou usuário não autenticado';
      case 403:
        return 'Acesso não autorizado';
      case 404:
        return 'Recurso não encontrado';
      case 500:
        return 'Erro interno do servidor';
      default:
        return data.message || `Erro ${status}`;
    }
  }
  
  // Se for um erro de conexão
  if (error.request) {
    return 'Erro de conexão. Verifique sua internet.';
  }
  
  // Se for uma mensagem de erro simples
  if (error.message) {
    return error.message;
  }
  
  // Se for um objeto com propriedade message
  if (typeof error === 'object' && error.message) {
    return error.message;
  }
  
  // Se for uma string de erro
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Ocorreu um erro inesperado';
};

/**
 * Registra o erro no console e, se necessário, em um serviço de logs
 * @param {Error|Object} error - O erro a ser registrado
 * @param {string} context - Contexto onde o erro ocorreu
 */
export const logError = (error, context = 'App') => {
  console.error(`[${context}] Erro:`, error);
  
  // Aqui você poderia enviar o erro para um serviço de telemetria
  // como Sentry, New Relic, etc.
};

/**
 * Função auxiliar para criar uma mensagem de erro padronizada
 * @param {Error|Object|string} error - O erro capturado
 * @param {string} context - Contexto onde o erro ocorreu
 * @returns {string} - Mensagem de erro formatada
 */
export const handleError = (error, context = 'App') => {
  logError(error, context);
  return getErrorMessage(error);
};

export default {
  getErrorMessage,
  logError,
  handleError
}; 