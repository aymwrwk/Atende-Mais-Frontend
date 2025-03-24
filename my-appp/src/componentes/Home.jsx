import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Home.css';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';
import Header from "./Header";

/*const Header = () => {
  const [classOn, setClassOn] = useState(false);
}
const toggleMenu = () => {
  setMenuAberto(!menuAberto);
};*/

const Home = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);



  
  const [statusMap] = useState({
    andamento: 'andamento',
    pronto: 'pronto',
    entregue: 'entregue',
    cancelar: 'cancelar',
  });

 
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [contagem, setContagem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classOn, setClassOn] = useState(false);

  axios.defaults.withCredentials = true;

  // Mock dos dados de pedidos
  const pedidosMock = [
    { reference_id: '123', status: 'andamento', quantity: 2, description: 'Jantinha com espeto de frango com bacon + espeto adicional de frango', hora: '10:00' },
    { reference_id: '456', status: 'pronto', quantity: 1, description: 'Jantinha com espeto de frango com bacon', hora: '11:00' },
    { reference_id: '789', status: 'entregue', quantity: 3, description: 'Pedido 3', hora: '12:00' },
  ];

  // Mock dos dados de contagem
  const contagemMock = ["Batata 5", "Jantinha 10", "Táboa 15"]; // Exemplo de contagens

  // Função para buscar pedidos do backend
  const buscarPedidos = async () => {
    try {
      // Obter o token do localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Usuário não autenticado');
        navigate('/login');
        return;
      }

      const response = await axios.get('https://atende-mais.shop:8080/api/v1/pedido/lista-pedidos',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Verifique a estrutura da resposta (ajuste conforme seu backend)
      console.log("Resposta da API:", response.data);
      setPedidos(response.data); // Ou response.data.prefixos se for um objeto
      //setPedidos(pedidosMock);

    } catch (err) {
      // Caso o backend retorne um status 401 (não autorizado), exibe a mensagem adequada
      if (err.response) {
        if (err.response.status === 401) {
          setError("Você não tem autorização para acessar esses pedidos.");
        } else {
          setError("Erro ao buscar pedidos: " + err.response.data);
        }
      } else {
        setError("Erro ao buscar pedidos: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  //const respostaBackend = null; // Simulando uma resposta nula

  // Função para buscar pedidos do backend
  const contarPedidos = async () => {
    try {
      // Obter o token do localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Usuário não autenticado');
        navigate('/login');
        return;
      }

      const response = await axios.get('https://atende-mais.shop:8080/api/v1/pedido/contar',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Verifique a estrutura da resposta (ajuste conforme seu backend)
      console.log("Resposta da API:", response.data);
      setContagem(response.data); // Ou response.data.prefixos se for um objeto
      //setContagem(contagemMock)

    } catch (err) {
      setError("Erro ao buscar pedidos: " + (err.response ? err.response.data : err.message));
    } finally {
      setLoading(false); // Atualiza o estado de carregamento
    }
  };

  // UseEffect para buscar pedidos e contagem ao montar o componente
  useEffect(() => {
    buscarPedidos();
    contarPedidos();
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
            contarPedidos();
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
      console.log('Tentando alterar status:', { pedidoId, hora, novoStatus });
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
          {contagem.map((item, index) => (
            <li className="li-pedidos-mobile" key={index}>{item}</li>
          ))}
        </ul>
      </div>
     
     

      <div className="pedido-container">
        {pedidos.length === 0 ? (
        
       

        <div className="div-mensagem-sem-pedido3">
        <p className="mensagem-sem-pedidos3">Ainda não há pedidos</p>
      </div>
          
        ) : (
          pedidos.map((pedido, index) => (

            <div className="conteudo-wrapper" key={index}>
              {/* Checkbox à esquerda */}


              <div className="div-checkbox">
                <div className="checkbox-container">
                  <div className="checkbox-container">
                    <label className="label-entregue">
                      <input
                        type="checkbox"
                        className="checkbox-entregue"
                        checked={pedido.status === 'entregue'}
                        onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'entregue' ? 'pronto' : 'entregue')}
                      />
                      <h1 className="texto-entregue">Entregue</h1>
                    </label>
                    <label className="label-cancelar">
                      <input
                        type="checkbox"
                        className="checkbox-cancelar"
                        checked={pedido.status === 'cancelar'}
                        onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'cancelar' ? 'pronto' : 'cancelar')}
                      />
                      <h1 className="texto-cancelar">Cancelar</h1>
                    </label>
                  </div>
                </div>
              </div>


              <div className="conteudo-detalhes">

                <div className="status-container">
                  <div className={`indicador-status ${pedido.status}`}></div>
                </div>

                <div className="quantidade-all">
                  <h2 className="quantidadeTexto">Quantidade</h2>
                  <h2 className="quantidade">{pedido.quantity}</h2>
                </div>
                <div className="senha-all3">
                  <h2 className="senhaTexto3" style={{ fontSize: '16px' }}>Senha</h2>
                  <h1 className="senha3" style={{ fontSize: '25px' }}>{pedido.reference_id}</h1>
                </div>
                <div className="checkbox-detalhes">
                  <p className="texto-checkbox">Pronto</p>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox-detalhe"
                      checked={pedido.status === 'pronto'}
                      onChange={() =>
                        alterarStatus(
                          pedido.reference_id,
                          pedido.hora,
                          pedido.status === 'pronto' ? 'andamento' : 'pronto'
                        )
                      }
                    />
                  </label>
                </div>
                <div className="div-descricao">
                  <p className="descricao">{pedido.description}</p>
                </div>

              </div>
            </div>


          ))
        )}
      </div>
      <div className="div-containers-lista">
        <div className="container-lista">
          <div className="contagem-pedidos">
            <ul className="ul-pedidos">
              {contagem.map((item, index) => (
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