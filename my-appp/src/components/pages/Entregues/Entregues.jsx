import React, { useState, useEffect, useCallback } from "react";
import SockJS from 'sockjs-client';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './Entregues.css';
import Header from "../../../components/common/Header/Header";
import PedidoCard from "../../../components/common/PedidoCard";
import CheckboxGroup from "../../../components/common/CheckboxGroup";
import { API_BASE_URL } from "../../../utils/config";

const STATUS = {
  ANDAMENTO: 'andamento',  // amarelo
  PRONTO: 'pronto',        // verde
  ENTREGUE: 'entregue',    // vermelho
  CANCELAR: 'cancelar'     // status adicional
};

const Entregues = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Função para buscar pedidos da API
  const buscarPedidos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Usuário não autenticado');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/pedido/entregues`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("Resposta da API:", response.data);
      setPedidos(response.data);
    } catch (err) {
      setError("Erro ao buscar pedidos: " + (err.response ? err.response.data : err.message));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Função para alterar o status de um pedido
  const alterarStatus = useCallback(async (pedidoId, hora, novoStatus) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Usuário não autenticado');
        navigate('/login');
        return;
      }

      await axios.post(`${API_BASE_URL}/pedido/alterar-status`, {
        pedidoId: pedidoId,
        novoStatus: novoStatus,
        hora: hora
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Atualiza o status localmente
      setPedidos(prevPedidos => 
        prevPedidos.map(pedido =>
          pedido.reference_id === pedidoId && pedido.hora === hora
            ? { ...pedido, status: novoStatus }
            : pedido
        )
      );

    } catch (error) {
      console.error('Erro ao alterar status:', error);
      setError('Erro ao alterar status do pedido');
    }
  }, [navigate]);

  // Configura o manipulador de alterações de status para o PedidoCard
  const handleStatusChange = useCallback((pedido, status) => {
    alterarStatus(pedido.reference_id, pedido.hora, status);
  }, [alterarStatus]);

  // Configuração inicial: buscar pedidos ao montar o componente
  useEffect(() => {
    buscarPedidos();
  }, [buscarPedidos]);

  // Configuração do WebSocket para atualizações em tempo real
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL.replace('/api/v1', '')}/wss-notifications?token=${token}`),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        console.log("Conectado ao WebSocket");
        client.subscribe('/topic/notifications', () => {
          // Atualiza os pedidos quando receber notificação
          setTimeout(buscarPedidos, 1000);
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
  }, [buscarPedidos]);

  // Renderização do componente de verificação de carregamento
  if (loading) {
    return <h1>Carregando pedidos...</h1>;
  }

  // Renderiza o conteúdo para cada pedido
  const renderCheckboxes = (pedido) => {
    // Definindo as opções de status para o CheckboxGroup
    const statusOptions = [
      { label: 'Pronto', value: STATUS.PRONTO },
      { label: 'Entregue', value: STATUS.ENTREGUE },
      { label: 'Cancelar', value: STATUS.CANCELAR }
    ];

    // Lidando com a alteração do status
    const handleCheckboxChange = (novoStatus) => {
      alterarStatus(pedido.reference_id, pedido.hora, novoStatus);
    };

    return (
      <div className="checkbox-container">
        <div className="checkbox-container2">
          <CheckboxGroup
            options={statusOptions}
            activeValue={pedido.status}
            onChange={handleCheckboxChange}
            classPrefix="2"
          />
        </div>
      </div>
    );
  };

  // Verificando se não há pedidos
  const semPedidos = !pedidos || pedidos.length === 0;

  return (
    <div className="header">
      <header className="header-menu">
        <Header />
        <div className="random-div">
          <p className="p-header-center">
            Entregues
          </p>
        </div>
      </header>

      <div className="titl">
        <div className="imagem-titulo"></div>
      </div>
      
      <div className="container-contador2"></div>
      
      <div className="pedido-container2">
        {!semPedidos ? (
          <ul>
            <br />
            {pedidos.map((pedido, index) => (
              <PedidoCard
                key={`${pedido.reference_id}-${pedido.hora}`}
                pedido={pedido}
                onStatusChange={handleStatusChange}
                leftContent={renderCheckboxes(pedido)}
                showHorario={true}
                className="conteudo-wrapper2"
              />
            ))}
          </ul>
        ) : (
          <div className="div-mensagem-sem-pedido1">
            <p className="mensagem-sem-pedidos1">Ainda não há pedidos entregues ou cancelados</p>
          </div>
        )}
        <br />
        <br />
      </div>
      
      <div className="div-containers-lista2">
        <div className="container-lista2">
          <div className="contagem-pedidos">
            <ul className="ul-pedidos"></ul>
          </div>
        </div>
        <div className="container-lista2"></div>
      </div>
    </div>
  );
};

export default Entregues;