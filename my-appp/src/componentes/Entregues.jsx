import React, { useState, useEffect } from "react";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './Entregues.css';


const Entregues = () => {
  const [classOn, setClassOn] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [contagem, setContagem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMap, setStatusMap] = useState({
    andamento: 'andamento', //amarelo
    pronto: 'pronto', //verde
    entregue: 'entregue', //vermelho
    cancelar: 'cancelar', // status adicional, se necessário
  });

  // Mock dos dados de pedidos
  const pedidosMock = [
    { reference_id: '123', status: 'andamento', quantity: 2, description: 'Jantinha com espeto de frango com bacon', hora: '10:00' },
    { reference_id: '456', status: 'pronto', quantity: 1, description: 'Táboa carne e Batata Frita', hora: '11:00' },
    { reference_id: '789', status: 'entregue', quantity: 3, description: 'Batata Especial', hora: '12:00' },
  ];
  // Função para buscar pedidos do backend
  const buscarPedidos = async () => {
    try {
      //const response = await axios.get('https://atende-mais.shop/pedido/entregues'); // Chamada ao endpoint
      //const response = await axios.get('http://192.168.1.6:8080/pedido/entregues');
      //setPedidos(response.data); // Atualiza o estado com os dados dos pedidos
      setPedidos(pedidosMock);
    }
    finally {
      setLoading(false); // Atualiza o estado de carregamento
    }
  };

  // UseEffect para buscar pedidos e contagem ao montar o componente
  useEffect(() => {
    buscarPedidos();
  }, []);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('https://atende-mais.shop/wss-notifications'),
      //webSocketFactory: () => new SockJS('http://192.168.1.6/wss-notifications'),
      //webSocketFactory: () => new SockJS('http://localhost:8080/ws-notifications'),
      onConnect: () => {
        console.log("Conectado ao WebSocket");
        client.subscribe('/topic/notifications', (message) => {
          console.log("Notificação recebida:", message.body);

          // Adiciona um atraso de 5 segundos antes de chamar buscarPedidos
          setTimeout(() => {
            buscarPedidos();
          }, 5000);
        });
      },
      onDisconnect: () => {
        console.log("Desconectado do WebSocket");
        // Tente reconectar após 5 segundos
        setTimeout(() => client.activate(), 5000);
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
        console.error('Details:', frame.body);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  // Verificação do estado de carregamento
  if (loading) {
    return <h1>Carregando pedidos...</h1>;
  }

  // Função para alterar o status do pedido
  const alterarStatus = async (pedidoId, hora, novoStatus) => {
    try {
      const response = await axios.post('https://atende-mais.shop/pedido/alterar-status', {
        //const response = await axios.post('http://192.168.1.6:8080/pedido/alterar-status', {
        pedidoId: pedidoId,
        novoStatus: novoStatus,
        hora: hora // Enviando o timestamp junto com o pedidoId
      });

      console.log(response.data); // Mensagem de sucesso

      // Atualiza o status localmente após sucesso na requisição
      const pedidosAtualizados = pedidos.map(pedido =>
        pedido.reference_id === pedidoId && pedido.hora === hora
          ? { ...pedido, status: novoStatus }
          : pedido
      );
      setPedidos(pedidosAtualizados);


      // Requisita uma nova busca de pedidos após 5 segundos
      setTimeout(() => {
        buscarPedidos();
      }, 5000);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  return (
    <div className="header">
      <header class="header-menu">
        <nav>
          <ul class="menu">
            <li><a href="/inicio">Inicio</a></li>
            <li><a href="/prefixo">Prefixos</a></li>
          </ul>
        </nav>
      </header>

      <div className="titl">
        <div className="imagem-titulo">
        </div>
      </div>
      <div className="container-contador2">
      </div>
      <div className="pedido-container2">
        <ul>
<br />
          {pedidos && pedidos.map((pedido, index) => {
            const statusClass = statusMap[pedido.status.toLowerCase()] || '';
            return (

              <div className="conteudo-wrapper2" key={pedido.reference_id}>
                {/* Checkbox à esquerda */}



                <div className="div-checkbox">
                  <div className="checkbox-container">
                    <div className="checkbox-container">
                    <label className="label-pronto2">
                        <input
                          type="checkbox"
                          className="checkbox-pronto2"
                          checked={pedido.status === 'pronto'}
                          onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'cancelar' ? 'pronto' : 'cancelar')}
                        />
                        <h1 className="texto-pronto">Pronto</h1>
                      </label>
                      <label className="label-entregue2">
                        <input
                          type="checkbox"
                          className="checkbox-entregue2"
                          checked={pedido.status === 'entregue'}
                          onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'entregue' ? 'pronto' : 'entregue')}
                        />
                        <h1 className="texto-entregue2">Entregue</h1>
                      </label>
                      <label className="label-cancelar2">
                        <input
                          type="checkbox"
                          className="checkbox-cancelar2"
                          checked={pedido.status === 'cancelar'}
                          onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'cancelar' ? 'pronto' : 'cancelar')}
                        />
                        <h1 className="texto-cancelar2">Cancelar</h1>
                      </label>
                    </div>
                  </div>
                </div>


                <div className="conteudo-detalhes">

                  <div className="status-container2">
                    <div className={`indicador-status2 ${pedido.status}`}></div>
                  </div>

                  <div className="quantidade-all2">
                    <h2 className="quantidadeTexto">Quantidade</h2>
                    <h2 className="quantidade">{pedido.quantity}</h2>
                  </div>
                  <div className="senha-all4">
                    <h2 className="senhaTexto3" style={{ fontSize: '16px' }}>Senha</h2>
                    <h1 className="senha3" style={{ fontSize: '25px' }}>{pedido.reference_id}</h1>
                  </div>

                  <div className="horario">

                  <h1 className="hora">{pedido.hora.split(':').slice(0, 2).join(':')}</h1>
                  <h1 className="horario-texto">Horário</h1>
          
                  </div>
                  <div className="div-descricao">
                    <p className="descricao">{pedido.description}</p>
                  </div>

                </div>
              </div>
            );
          })}
        </ul>
        <p className="mensagem-sem-pedidos1">Ainda não há pedidos entregues ou cancelados</p>
      </div>
      <div className="div-containers-lista2">
        <div className="container-lista2">
          <div className="contagem-pedidos">
            <ul className="ul-pedidos">
              {contagem.map((item, index) => (
                <li className="li-pedidos" key={index}>{item}</li>

              ))}


            </ul>
          </div>
        </div>
        <div className="container-lista2"></div>
      </div>
    </div>



  );
};

export default Entregues;