import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeCliente.css';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useNavigate, useParams } from 'react-router-dom';

const HomeCliente = () => {
  const { idEstabelecimento } = useParams(); // Aqui você pega o idEstabelecimento da URL
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controle do modal de senha e senhas monitoradas
  const [showModal, setShowModal] = useState(true);
  const [senhaInput, setSenhaInput] = useState('');
  const [monitoredSenhas, setMonitoredSenhas] = useState([]);
  const [notifiedOrders, setNotifiedOrders] = useState([]);

  axios.defaults.withCredentials = true;

  // Carrega as senhas monitoradas do localStorage ao montar o componente
  useEffect(() => {
    const storedSenhas = localStorage.getItem('monitoredSenhas');
    if (storedSenhas) {
      const parsed = JSON.parse(storedSenhas);
      setMonitoredSenhas(parsed);
      if (parsed.length > 0) {
        setShowModal(false);
      }
    }
  }, []);

  // Persiste as senhas monitoradas no localStorage
  useEffect(() => {
    localStorage.setItem('monitoredSenhas', JSON.stringify(monitoredSenhas));
  }, [monitoredSenhas]);

  // Função para buscar os pedidos do backend
  const buscarPedidos = async () => {
    try {
      const response = await axios.get(
        `https://atende-mais.shop:8080/api/v1/pedido/${idEstabelecimento}/pedidos-clientes`,
      );
      setPedidos(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.status === 401 
          ? "Você não tem autorização para acessar esses pedidos." 
          : "Erro ao buscar pedidos: " + err.response.data);
      } else {
        setError("Erro ao buscar pedidos: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedidos();
  }, [idEstabelecimento]); // Atualiza a busca quando o idEstabelecimento mudar

  // Configuração do WebSocket para atualizações em tempo real
  useEffect(() => {
    const token = localStorage.getItem('token');
    const client = new Client({
      webSocketFactory: () => new SockJS('https://atende-mais.shop:8080/wss-notifications?token=' + token),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        console.log("Conectado ao WebSocket");
        client.subscribe('/topic/notifications', (message) => {
          console.log("Notificação recebida:", message.body);
          setTimeout(() => {
            buscarPedidos();
          }, 3000);
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

  // Envia notificações de navegador para pedidos com status "pronto"
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    const ordersPronto = pedidos.filter(order =>
      monitoredSenhas.includes(order.reference_id) &&
      order.status === 'pronto' &&
      !notifiedOrders.includes(order.reference_id)
    );
    ordersPronto.forEach(order => {
      try {
        new Notification("Pedido Pronto!", {
          body: `Seu pedido com senha ${order.reference_id} está pronto! Retire no bar.`,
        });
        setNotifiedOrders(prev => [...prev, order.reference_id]);
      } catch (err) {
        console.error("Erro ao enviar notificação:", err);
      }
    });
  }, [pedidos, monitoredSenhas, notifiedOrders]);

  // Filtra os pedidos: exibe apenas os que possuem a senha monitorada e ignora "cancelar" e "entregue"
  const filteredPedidos = pedidos.filter(order =>
    monitoredSenhas.includes(order.reference_id) &&
    order.status !== 'cancelar' &&
    order.status !== 'entregue'
  );

  useEffect(() => {
    const updatedSenhas = monitoredSenhas.filter(senha => {
      // Filtra os pedidos que têm essa senha
      const orders = pedidos.filter(order => String(order.reference_id) === String(senha));
      // Se existir pelo menos um pedido, e todos estiverem finalizados, remove a senha.
      if (orders.length > 0) {
        return orders.some(order => order.status !== 'entregue' && order.status !== 'cancelar');
      }
      // Se não houver nenhum pedido, mantenha a senha (para aguardar que o pedido chegue)
      return true;
    });
    if (updatedSenhas.length !== monitoredSenhas.length) {
      setMonitoredSenhas(updatedSenhas);
    }
  }, [pedidos, monitoredSenhas]);
  
  // Adiciona a senha monitorada quando o usuário clicar em "Continuar"
  const handleContinuar = () => {
    const senha = senhaInput.trim();
    if (senha !== "") {
      if (!monitoredSenhas.includes(senha)) {
        setMonitoredSenhas([...monitoredSenhas, senha]);
      }
      setSenhaInput("");
      setShowModal(false);
    }
  };

  // Permite acompanhar outro pedido (abre novamente o modal)
  const handleAcompanharOutro = () => {
    setShowModal(true);
  };

  if (loading) {
    return <h1>Carregando pedidos...</h1>;
  }

  return (
    <div className="header">
    <header class="header-menu">
      <nav>
        <ul class="menu">
          <li><a href="/entregues">Entregues</a></li>
          <li><a href="/prefixo">Prefixos</a></li>
        </ul>
      </nav>
    </header>

    <div className="imagem-titulo-home"></div>

    <div className="contagem-pedidos-mobile">

     
    </div>

      <div className="content-wrapper">
        <button className="btn-acompanhar" onClick={handleAcompanharOutro}>
          Acompanhar outro pedido
        </button>

        {/* Modal de senha */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Digite a senha do pedido</h2>
              <input 
                type="text"
                value={senhaInput}
                onChange={(e) => setSenhaInput(e.target.value)}
                placeholder="Senha do pedido"
              />
              <button className='button-continuar-cliente' onClick={handleContinuar}>Continuar</button>
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {filteredPedidos.length === 0 ? (
          <p className="no-orders">Não há pedidos para a(s) senha(s) monitorada(s).</p>
        ) : (
          filteredPedidos.map((pedido, index) => (
            <div className="pedido-wrapper" key={index}>
              <div className="pedido-content">
                <div className="pedido-info">
                  <div className='divquantidade-senha-cliente'>
                    <p><strong>Quantidade:</strong> {pedido.quantity}</p>
                    <p><strong>Senha:</strong> {pedido.reference_id}</p>
                  </div>
                  <p className="pedido-description">{pedido.description}</p>
                </div>
                <div className="status-indicator">
                  <div className={`status-circle ${pedido.status}`}></div>
                </div>
              </div>
              <div className={`status-banner ${pedido.status}`}>
                {pedido.status === 'andamento' && (
                  <p>Seu pedido está em produção. Aguarde enquanto preparamos seu pedido.</p>
                )}
                {pedido.status === 'pronto' && (
                  <p>Seu pedido está pronto! Retire no bar.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeCliente;
