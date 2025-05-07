/**
 * Exportação centralizada de todos os serviços
 * Facilita a importação em outros componentes
 */

import authService from './authService';
import reportService from './reportService';

export {
  authService,
  reportService
};

/**
 * Exemplo de uso:
 * import { authService, reportService } from '../services';
 */ 