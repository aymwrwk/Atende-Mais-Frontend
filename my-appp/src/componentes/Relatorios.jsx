import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Relatorios.css';
import Header from "./Header";

const Reports = () => {
  const [viewType, setViewType] = useState('daily'); // 'daily' ou 'weekly'
  const [message, setMessage] = useState('');
  const token = 'seu_token_aqui';

  // useEffect que limpa a mensagem após 4 segundos sempre que ela for definida
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const downloadDailyReport = (date) => {
    const today = new Date();
    if (date > today) {
      setMessage("Relatório não disponível para datas futuras");
      return;
    }
    setMessage("Baixando relatório...");
    const formattedDate = date.toISOString().split('T')[0];

    axios
      .get(`http://localhost:8080/relatorio/getRelatorio?dataString=${formattedDate}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `relatorio_${formattedDate}.pdf`);
        document.body.appendChild(link);
        link.click();
        setMessage("Relatório baixado com sucesso!");
      })
      .catch(error => {
        setMessage("Erro ao baixar relatório.");
      });
  };

  const getWeeklyGroups = () => {
    const groups = {};
    const meses = [new Date().getMonth() - 1, new Date().getMonth()];
    meses.forEach(m => {
      let month = m;
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
  };

  const downloadWeeklyReport = (sundayDate) => {
    const today = new Date();
    if (sundayDate > today) {
      setMessage("Relatório não disponível para datas futuras");
      return;
    }
    setMessage("Baixando relatório...");
    const formattedDate = sundayDate.toISOString().split('T')[0];

    axios
      .get(`http://localhost:8080/relatorio/getRelatorio?dataString=${formattedDate}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: 'application/pdf' })
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `relatorio_${new Date().toISOString()}.pdf`);
        document.body.appendChild(link);
        link.click();
        setMessage("Relatório baixado com sucesso!");
      })
      .catch(error => {
        setMessage("Erro ao baixar relatório.");
      });
  };

  return (
    <div>
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
      <div className='div-botoes-relatorios' style={{ marginBottom: '20px' }}>
        <button className='button-relatorios'
          onClick={() => { setViewType('daily'); setMessage(''); }}
          disabled={viewType === 'daily'}
          style={{ marginRight: '10px' }}
        >
          Diário
        </button>
        <button className='button-relatorios'
          onClick={() => { setViewType('weekly'); setMessage(''); }}
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
            gap: '10px',
            justifyContent: 'center'
          }}>
            {getWeekDays().map((date, index) => (
              <div className='dias'
                key={index}
                style={{
                  border: '1px solid #ccc',
                  width: '19%',
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => downloadDailyReport(date)}
              >
                <strong>
                  {date.toLocaleDateString('pt-BR', { weekday: 'long' })}
                </strong>
                <div>{date.getDate()}</div>
              </div>
            ))}
          </div>
        )}

        {viewType === 'weekly' && (
          <div className='div-conteudo-semanal'>
            {Object.entries(getWeeklyGroups()).map(([month, sundays]) => (
              <div key={month} style={{ marginBottom: '20px' }}>
                <div className='div-h2-relatorios'>
                  <h2 className='h2-relatorios'>Mês: {month}</h2>
                </div>
                <div className='test' style={{ display: 'flex', flexDirection: 'column' }}>
                  {sundays.map((sunday, idx) => (
                    <div className='div-semana-relatorios'
                      key={idx}
                      style={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        margin: '5px',
                        cursor: 'pointer'
                      }}
                      onClick={() => downloadWeeklyReport(sunday)}
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
          <div className='mensagem-erro-ralatorio' style={{ marginTop: '20px', color: 'red' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
