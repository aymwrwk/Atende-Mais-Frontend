/**
 * Utilitários para manipulação de datas
 */

/**
 * Formata uma data para exibição
 * @param {Date} date - A data a ser formatada
 * @param {string} format - O formato desejado ('short', 'long', 'numeric')
 * @param {string} locale - O locale para formatação (padrão: 'pt-BR')
 * @returns {string} - Data formatada
 */
export const formatDate = (date, format = 'short', locale = 'pt-BR') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    case 'short':
      return dateObj.toLocaleDateString(locale);
    case 'numeric':
      return dateObj.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    case 'iso':
      return dateObj.toISOString().split('T')[0];
    default:
      return dateObj.toLocaleDateString(locale);
  }
};

/**
 * Verifica se uma data é hoje
 * @param {Date} date - A data a ser verificada
 * @returns {boolean} - true se a data for hoje, false caso contrário
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = date instanceof Date ? date : new Date(date);
  const today = new Date();
  
  return dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear();
};

/**
 * Obtém a data de início da semana (segunda-feira)
 * @param {Date} date - A data de referência (padrão: data atual)
 * @returns {Date} - Data da segunda-feira da semana
 */
export const getStartOfWeek = (date = new Date()) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const day = dateObj.getDay();
  const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
  
  const monday = new Date(dateObj);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  
  return monday;
};

/**
 * Obtém os dias da semana a partir de uma data
 * @param {Date} date - A data de referência (padrão: data atual)
 * @returns {Array<Date>} - Array com os 7 dias da semana
 */
export const getWeekDays = (date = new Date()) => {
  const monday = getStartOfWeek(date);
  
  return Array(7).fill(null).map((_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
};

export default {
  formatDate,
  isToday,
  getStartOfWeek,
  getWeekDays
}; 