/**
 * Exportação centralizada de utilitários
 * Facilita a importação em outros componentes
 */

import config, { API_BASE_URL, API_ENDPOINTS, TIME_CONFIG } from './config';
import errorHandler, { getErrorMessage, logError, handleError } from './errorHandler';
import dateUtils, { formatDate, isToday, getStartOfWeek, getWeekDays } from './dateUtils';

// Exportação com names exports
export {
  // Config
  API_BASE_URL,
  API_ENDPOINTS,
  TIME_CONFIG,
  
  // Error handling
  getErrorMessage,
  logError,
  handleError,
  
  // Date utils
  formatDate,
  isToday,
  getStartOfWeek,
  getWeekDays
};

// Exportação como objetos
export {
  config,
  errorHandler,
  dateUtils
};

/**
 * Exemplo de uso:
 * import { formatDate, API_ENDPOINTS } from '../utils';
 * ou
 * import { dateUtils } from '../utils';
 */ 