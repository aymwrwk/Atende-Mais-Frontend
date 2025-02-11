import React, { useState } from 'react';
import axios from 'axios';
import './Relatorios.css';

const Reports = () => {
  const [viewType, setViewType] = useState('daily'); // 'daily' ou 'weekly'
  const [message, setMessage] = useState('');
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdGVuZGUtbWFpcy1hcGkiLCJzdWIiOiJsdWNhc3BpenphQGdtYWlsLmNvbSIsImV4cCI6M...'; // seu token

  // Função que retorna os 7 dias da semana com base na segunda-feira
  const getWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (domingo) a 6 (sábado)
    // Considerando que a semana começa na segunda
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

  // Função para disparar o download do relatório diário
  const downloadDailyReport = (date) => {
    const today = new Date();
    if (date > today) {
      setMessage("Relatório não disponível para datas futuras");
      return;
    }
    setMessage("Baixando relatório...");
    const formattedDate = date.toISOString().split('T')[0]; // formato YYYY-MM-DD

    axios
      .get(`http://localhost:8080/relatorio/getRelatorio?dataString=${formattedDate}`, {
        responseType: 'blob', // para receber o PDF
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        // Cria um URL para o blob e aciona o download
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

  // Função que organiza as semanas agrupadas por mês para a visualização semanal.
  // Neste exemplo, vamos exibir as semanas dos dois meses: o mês atual e o anterior.
  const getWeeklyGroups = () => {
    const groups = {};
    // Cria um array com o mês anterior e o atual
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
      // Percorre os dias do mês e seleciona os domingos
      for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        if (d.getDay() === 0) { // domingo
          sundays.push(new Date(d));
        }
      }
      // Usamos o nome do mês e o ano como chave
      groups[`${year}-${month + 1}`] = sundays;
    });
    return groups;
  };

  // Função para disparar o download do relatório semanal (usando o domingo como referência)
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

  return (
    <div>


      
 
      <header class="header-menu">
    <nav>
      <ul class="menu">
        <li><a href="/inicio">Início</a></li>
        <li><a href="/entregues">Entregues</a></li>
      </ul>
    </nav>
  </header>
     
      <div className="imagem-titulo">

      </div>
      <div className="imagem-tituloo">

         
    
      </div>

      <div className="imagem-titulooo">

<ul>
<li><a href="/inicio">Início</a></li>

</ul>

</div>
      <header>
        <h1 className='h1-titulo-relatorios'>Relatórios</h1>
      </header>


    
          {/* Botões para alternar entre Diário e Semanal */}
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => { setViewType('daily'); setMessage(''); }}
              disabled={viewType === 'daily'}
              style={{ marginRight: '10px' }}
            >
              Diário
            </button>
            <button
              onClick={() => { setViewType('weekly'); setMessage(''); }}
              disabled={viewType === 'weekly'}
            >
              Semanal
            </button>
          </div>
          <div className='div-relatorios'>
  {/* Visualização Diário */}
  {viewType === 'daily' && (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '10px', 
      justifyContent: 'center'
    }}>
      {getWeekDays().map((date, index) => (
        <div
          key={index}
          style={{
            width: '18%', // Garante duas colunas
            padding: '10px',
            margin: '11px',
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
    
          {/* Visualização Semanal */}
          {viewType === 'weekly' && (
            <div>
              {Object.entries(getWeeklyGroups()).map(([month, sundays]) => (
                <div key={month} style={{ marginBottom: '20px' }}>
                  <h2 className='h2-relatorios'>
                    Mês: {month}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
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
            <div style={{ marginTop: '20px', color: 'blue' }}>
              {message}
            </div>
          )}
        </div>
</div>
  );
};

export default Reports;

