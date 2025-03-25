import React, { useState, useEffect } from "react";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './Entregues.css';
import Header from "./Header";
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

const Entregues = () => {
  const [pedidos, setPedidos] = useState([]);
  const [contagem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMap] = useState({
    andamento: 'andamento', //amarelo
    pronto: 'pronto', //verde
    entregue: 'entregue', //vermelho
    cancelar: 'cancelar', // status adicional, se necessário
  });

  const buscarPedidos = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Usuário não autenticado');
        navigate('/login');
        return;
      }

      const response = await axios.get('https://atende-mais.shop:8080/api/v1/pedido/entregues',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log("Resposta da API:", response.data);
      setPedidos(response.data);

    } catch (err) {
      setError("Erro ao buscar pedidos: " + (err.response ? err.response.data : err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedidos();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const client = new Client({
      webSocketFactory: () => new SockJS('https://atende-mais.shop:8080/wss-notifications?token=' + token),

      connectHeaders: {
        Authorization: `Bearer ${token}`
      },

      onConnect: () => {
        console.log("Conectado ao WebSocket");
        client.subscribe('/topic/notifications', (message) => {
          console.log("Notificação recebida:", message.body);

          setTimeout(() => {
            buscarPedidos();
          }, 1000);
        });
      },

      onDisconnect: () => {
        console.log("Desconectado do WebSocket");
        setTimeout(() => client.activate(), 5000);
      },

      onStompError: (frame) => {
        console.error('Erro STOMP:', frame.headers['message']);
      }
    });

    client.activate();

    return () => client.deactivate();
  }, []);

  // Verificação do estado de carregamento
  if (loading) {
    return <h1>Carregando pedidos...</h1>;
  }

  // Função para alterar o status do pedido
  const alterarStatus = async (pedidoId, hora, novoStatus) => {
    try {
      // Obter o token do localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Usuário não autenticado');
        navigate('/login');
        return;
      }

      const response = await axios.post('https://atende-mais.shop:8080/api/v1/pedido/alterar-status', {
        pedidoId: pedidoId,
        novoStatus: novoStatus,
        hora: hora // Enviando o timestamp junto com o pedidoId
      },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
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
        // buscarPedidos();
      }, 3000);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  return (
    <div className="header">
      <header class="header-menu">
        <Header />
        <div className="random-div">
          <p className="p-header-center">
            Entregues
          </p>
        </div>
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
                    <div className="checkbox-container2">
                      <label className="label-pronto2">
                        <input
                          type="checkbox"
                          className="checkbox-pronto2"
                          checked={pedido.status === 'pronto'}
                          onChange={() =>
                            alterarStatus(pedido.reference_id, pedido.hora, 'pronto')
                          }
                        />
                        <h1 className="texto-pronto">Pronto</h1>
                      </label>
                      <label className="label-entregue2">
                        <input
                          type="checkbox"
                          className="checkbox-entregue2"
                          checked={pedido.status === 'entregue'}
                          onChange={() =>
                            alterarStatus(pedido.reference_id, pedido.hora, 'entregue')
                          }
                        />
                        <h1 className="texto-entregue2">Entregue</h1>
                      </label>
                      <label className="label-cancelar2">
                        <input
                          type="checkbox"
                          className="checkbox-cancelar2"
                          checked={pedido.status === 'cancelar'}
                          onChange={() =>
                            alterarStatus(pedido.reference_id, pedido.hora, 'cancelar')
                          }
                        />
                        <h1 className="texto-cancelar2">Cancelar</h1>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="conteudo-detalhes">

                  <div className="status-container2">
                    <div className={`indicador-status ${pedido.status}`}></div>
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
        <br />
        <br />
        <div className="div-mensagem-sem-pedido1">
          <p className="mensagem-sem-pedidos1">Ainda não há pedidos entregues ou cancelados</p>
        </div>
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