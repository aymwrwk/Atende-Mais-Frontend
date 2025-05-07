import axios from 'axios';
import { API_ENDPOINTS } from '../utils/config';
import authService from './authService';

/**
 * Serviço para gerenciar operações relacionadas a relatórios
 */
const reportService = {
  /**
   * Baixa um relatório para uma data específica
   * @param {Date} date - Data do relatório
   * @returns {Promise} Blob do relatório em formato PDF
   */
  downloadReport: async (date) => {
    if (!authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }
    
    const formattedDate = date.toISOString().split('T')[0];
    
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.report.getReport}?dataString=${formattedDate}`,
        {
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      throw error;
    }
  },
  
  /**
   * Gera os dias da semana atual
   * @returns {Array<Date>} Array com os 7 dias da semana atual
   */
  getWeekDays: () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    
    return Array(7).fill(null).map((_, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      return day;
    });
  },
  
  /**
   * Gera grupos de semanas para visualização mensal
   * @returns {Object} Objeto com as semanas agrupadas por mês
   */
  getWeeklyGroups: () => {
    const groups = {};
    const currentMonth = new Date().getMonth();
    const meses = [currentMonth - 1, currentMonth];
    
    meses.forEach(monthIndex => {
      let month = monthIndex;
      let year = new Date().getFullYear();
      
      if (month < 0) {
        month = 11;
        year = year - 1;
      }
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const sundays = [];
      
      for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        if (d.getDay() === 0) {
          sundays.push(new Date(d));
        }
      }
      
      groups[`${year}-${month + 1}`] = sundays;
    });
    
    return groups;
  },
  
  /**
   * Verifica se um relatório está disponível para uma data
   * @param {Date} date - Data a ser verificada
   * @returns {boolean} True se disponível, false caso contrário
   */
  isReportAvailable: (date) => {
    const today = new Date();
    return date <= today;
  }
};

export default reportService; 