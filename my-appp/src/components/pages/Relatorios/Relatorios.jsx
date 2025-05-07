import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Relatorios.css';
import Header from "../../../components/common/Header/Header";
import reportService from '../../../services/reportService';
import authService from '../../../services/authService';
import { TIME_CONFIG } from '../../../utils/config';
// Import direto da imagem de fundo
import backgroundImage from '../../../assets/imgs/item-bg.png';

// Estilo inline para garantir que a fonte seja aplicada
const fontStyle = {
  fontFamily: "'Montserrat', sans-serif"
};

// Estilos adicionais para garantir o carregamento da imagem de fundo
const backgroundStyle = {
  ...fontStyle,
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
};

const Reports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('daily');
  const [message, setMessage] = useState('');

  axios.defaults.withCredentials = true;

  // Limpar a mensagem após o tempo definido
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, TIME_CONFIG.messageTimeout);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Verificar autenticação ao carregar o componente
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  // Memoizando os dias da semana para evitar recálculos desnecessários
  const weekDays = reportService.getWeekDays();
  
  // Memoizando os grupos de semanas para evitar recálculos desnecessários
  const weeklyGroups = reportService.getWeeklyGroups();

  // Função para baixar um relatório
  const handleReportDownload = useCallback(async (date) => {
    if (!reportService.isReportAvailable(date)) {
      setMessage("Relatório não disponível para datas futuras");
      return;
    }
    
    setMessage("Baixando relatório...");
    
    try {
      const pdfBlob = await reportService.downloadReport(date);
      
      // Criar e disparar o download
      const formattedDate = date.toISOString().split('T')[0];
      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${formattedDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setMessage("Relatório baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      setMessage("Erro ao baixar relatório.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para alternar o tipo de visualização
  const switchViewType = useCallback((type) => {
    setViewType(type);
    setMessage('');
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="back" style={backgroundStyle} >
      <header className="header-menu">
        <Header />
        <div className="random-div">
          <p className="p-header-center">Relatórios</p>
        </div>
      </header>
      
      <div className="imagem-titulo"></div>
      <div className="imagem-tituloo"></div>
      <div className="imagem-titulooo">
        <ul>
          <li>
            <a href="/inicio">Início</a>
          </li>
        </ul>
      </div>
      
      {/* Botões para alternar entre Diário e Semanal */}
      <div className='div-botoes-relatorios'>
        <button 
          className='button-relatorios'
          onClick={() => switchViewType('daily')}
          disabled={viewType === 'daily'}
          style={{ marginRight: '10px' }}
        >
          Diário
        </button>
        <button 
          className='button-relatorios'
          onClick={() => switchViewType('weekly')}
          disabled={viewType === 'weekly'}
        >
          Semanal
        </button>
      </div>
      
      <div className='div-relatorios'>
        {viewType === 'daily' && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            width: '100%' 
          }}>
            <div className="row-flex">
              {weekDays.map((date, index) => (
                <div 
                  className='dias'
                  key={index}
                  onClick={() => handleReportDownload(date)}
                  style={{
                    border: '1px solid #ccc',
                    width: '20%',
                    fontSize:'15px',
                    padding: '10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '18px',
                    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                    marginTop: '1px',
                  }}
                >
                  <strong>
                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </strong>
                  <div>{date.getDate()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {viewType === 'weekly' && (
          <div className='div-conteudo-semanal'>
            {Object.entries(weeklyGroups).map(([month, sundays]) => (
              <div key={month} style={{ marginBottom: '20px' }}>
                <div className='div-h2-relatorios'>
                  <h2 className='h2-relatorios'>Mês: {month}</h2>
                </div>
                <div className='test' style={{ display: 'flex', flexDirection: 'column' }}>
                  {sundays.map((sunday, idx) => (
                    <div 
                      className='div-semana-relatorios'
                      key={idx}
                      onClick={() => handleReportDownload(sunday)}
                    >
                      Semana {idx + 1} - Domingo: {sunday.toLocaleDateString('pt-BR')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Exibição de mensagens */}
        {message && (
          <div className='mensagem-erro-ralatorio'>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;