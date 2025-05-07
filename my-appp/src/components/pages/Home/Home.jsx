import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import axios from 'axios';
import './Home.css';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';
import Header from "../../../components/common/Header/Header";
import PedidoCard from "../../../components/common/PedidoCard";
import CheckboxGroup from "../../../components/common/CheckboxGroup";
import { API_BASE_URL } from '../../../utils/config';
import { authService } from '../../../services';
import { handleError } from '../../../utils/errorHandler';
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

// Constantes
const STATUS = {
  ANDAMENTO: 'andamento',
  PRONTO: 'pronto',
  ENTREGUE: 'entregue',
  CANCELAR: 'cancelar',
};

const Home = () => {
  // States
  const [menuAberto, setMenuAberto] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [contagem, setContagem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refs
  const timersRef = useRef({});
  const navigate = useNavigate();

  // Configuração global do Axios
  axios.defaults.withCredentials = true;

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Usuário não autenticado');
      navigate('/login');
      return null;
    }
    return { 'Authorization': `Bearer ${token}` };
  }, [navigate]);

  // Função para buscar pedidos do backend
  const buscarPedidos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/pedido/lista-pedidos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("Resposta da API:", response.data);
      
      // Verifica se a resposta é um array antes de atualizar o estado
      if (Array.isArray(response.data)) {
        setPedidos(response.data);
      } else {
        console.error("Resposta da API de pedidos não é um array:", response.data);
        setPedidos([]);
      }
    } catch (err) {
      console.error("Erro completo:", err);
      if (err.response?.status === 401) {
        setError("Você não tem autorização para acessar esses pedidos.");
      } else {
        setError("Erro ao buscar pedidos: " + (err.response?.data || err.message));
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Função para contar pedidos
  const contarPedidos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/pedido/contar`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("Resposta da API contagem:", response.data);
      
      // Verifica se a resposta é um array antes de atualizar o estado
      if (Array.isArray(response.data)) {
        setContagem(response.data);
      } else {
        console.error("Resposta da API de contagem não é um array:", response.data);
        setContagem([]);
      }
    } catch (err) {
      console.error("Erro completo:", err);
      setError("Erro ao buscar contagem: " + (err.response?.data || err.message));
      setContagem([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Função para alterar status de um pedido
  const alterarStatus = useCallback(async (pedidoId, hora, index, novoStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado');
        navigate('/login');
        return;
      }

      console.log('Tentando alterar status:', { pedidoId, hora, novoStatus });
      
      await axios.post(
        `${API_BASE_URL}/pedido/alterar-status`,
        { pedidoId, novoStatus, hora },
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      // Atualiza o status localmente
      setPedidos(prevPedidos => 
        prevPedidos.map((pedido, idx) =>
          idx === index ? { ...pedido, status: novoStatus } : pedido
        )
      );

      // Gerencia o timer para atualização
      const pedidoKey = `${pedidoId}-${hora}-${index}`;
      if (timersRef.current[pedidoKey]) {
        clearTimeout(timersRef.current[pedidoKey]);
      }
      
      timersRef.current[pedidoKey] = setTimeout(() => {
        buscarPedidos();
        delete timersRef.current[pedidoKey];
      }, 3000);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  }, [buscarPedidos, navigate]);

  // Configura o manipulador de alterações de status para o PedidoCard
  const handleStatusChange = useCallback((pedido, index, status) => {
    alterarStatus(pedido.reference_id, pedido.hora, index, status);
  }, [alterarStatus]);

  // Opções de status para os checkboxes (memoizado para evitar recriações)
  const statusOptions = useMemo(() => [
    { label: 'Entregue', value: STATUS.ENTREGUE },
    { label: 'Cancelar', value: STATUS.CANCELAR }
  ], []);

  // Efeito para buscar dados ao montar o componente
  useEffect(() => {
    buscarPedidos();
    contarPedidos();
  }, [buscarPedidos, contarPedidos]);

  // Efeito para configurar WebSocket
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL.replace('/api/v1', '')}/wss-notifications?token=${token}`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      
      onConnect: () => {
        console.log("Conectado ao WebSocket");
        client.subscribe('/topic/notifications', (message) => {
          console.log("Notificação recebida:", message.body);
          
          setTimeout(() => {
            buscarPedidos();
            contarPedidos();
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
  }, [buscarPedidos, contarPedidos]);

  // Renderiza o conteúdo para os checkboxes de cada pedido
  const renderCheckboxes = useCallback((pedido, index) => {
    // Lidando com a alteração do status
    const handleCheckboxChange = (novoStatus) => {
      const statusAtual = pedido.status;
      // Se o pedido já está com este status, alterna para Pronto
      const statusParaAplicar = statusAtual === novoStatus ? STATUS.PRONTO : novoStatus;
      alterarStatus(pedido.reference_id, pedido.hora, index, statusParaAplicar);
    };

    return (
      <div className="checkbox-container">
        <CheckboxGroup
          options={statusOptions}
          activeValue={pedido.status}
          onChange={handleCheckboxChange}
        />
      </div>
    );
  }, [alterarStatus, statusOptions]);

  // Renderização condicional de carregamento
  if (loading) {
    return <h1>Carregando pedidos...</h1>;
  }

  if (error) {
    return <h1>Erro: {error}</h1>;
  }

  // Verificando se não há pedidos
  const semPedidos = !Array.isArray(pedidos) || pedidos.length === 0;

  return (
      <div className="header" style={backgroundStyle}>
        <header className="header-menu">
          <Header menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
        </header>
        <div className="random-div">
          <p className={`p-header-center ${menuAberto ? 'menu-aberto' : ''}`}>
            Início
          </p>
        </div>

        <div className="imagem-titulo-home"></div>

        <div className="contagem-pedidos-mobile">
          <ul className="ul-pedidos-mobile">
            {Array.isArray(contagem) && contagem.map((item, index) => (
              <li className="li-pedidos-mobile" key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="pedido-container">
          {semPedidos ? (
            <div className="div-mensagem-sem-pedido3" >
              <p className="mensagem-sem-pedidos3">Ainda não há pedidos</p>
            </div>
          ) : (
            pedidos.map((pedido, index) => (
              <PedidoCard
                key={`${pedido.reference_id}-${index}`}
                pedido={pedido}
                onStatusChange={(p, status) => handleStatusChange(p, index, status)}
                leftContent={renderCheckboxes(pedido, index)}
                showHorario={false}
                className="conteudo-wrapper"
              />
            ))
          )}
        </div>
        <div className="div-containers-lista">
          <div className="container-lista">
            <div className="contagem-pedidos">
              <ul className="ul-pedidos">
                {Array.isArray(contagem) && contagem.map((item, index) => (
                  <li className="li-pedidos" key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="container-lista1"></div>
          
        </div>
    </div>
  );
};

export default Home;