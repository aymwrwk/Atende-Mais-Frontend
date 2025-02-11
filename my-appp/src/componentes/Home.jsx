import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Home.css';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [classOn, setClassOn] = useState(false);
}

const Home = () => {
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
      //const response = await axios.get('https://191.101.70.241:8080/pedido/lista-pedidos', { withCredentials: true });
      //const response = await axios.get('https://atende-mais.shop/pedido/lista-pedidos', { withCredentials: true });
      //const response = await axios.get('http://192.168.1.6:8080/pedido/lista-pedidos', { withCredentials: true });
      //setPedidos(response.data); // Atualiza o estado com os dados dos pedidos
      setPedidos(pedidosMock);
      //setLoading(false);

    } catch (err) {
      setError("Erro ao buscar pedidos: " + (err.response ? err.response.data : err.message));
    } finally {
      setLoading(false); // Atualiza o estado de carregamento
    }
  };

  const respostaBackend = null; // Simulando uma resposta nula

  // Função para contar e organizar os pedidos
  const contarPedidos = async () => {
    try {
      const response = await axios.get('https://atende-mais.shop/pedido/contar', { withCredentials: true });
      //const response = await axios.get('http://192.168.1.6:8080/pedido/contar', { withCredentials: true });
      setContagem(response.data);
      //setContagem(contagemMock)
    } catch (error) {
      console.error("Erro ao contar pedidos:", error.response ? error.response.data : error.message);
      //alert("Erro ao contar pedidos: " + (error.response ? error.response.data : error.message));
    }
  };

  // Função para contar e organizar os pedidos
  /* const contarPedidos = async () => {
     try {
         const response = await axios.get('http://191.101.70.241:8080/pedido/contar', { withCredentials: true });
         setContagem(response.data);
     } catch (error) {
         console.error("Erro ao contar pedidos:", error.response ? error.response.data : error.message);
         alert("Erro ao contar pedidos: " + (error.response ? error.response.data : error.message));
     }
 };*/

  // UseEffect para buscar pedidos e contagem ao montar o componente
  useEffect(() => {
    buscarPedidos();
    contarPedidos();
  }, []);

  useEffect(() => {
    const client = new Client({
      //webSocketFactory: () => new SockJS('http://192.168.1.6:8080/wss-notifications'),
      webSocketFactory: () => new SockJS('https://atende-mais.shop/wss-notifications'),
      onConnect: () => {
        console.log("Conectado ao WebSocket");
        client.subscribe('/topic/notifications', (message) => {
          console.log("Notificação recebida:", message.body);


          setTimeout(() => {
            buscarPedidos();
          }, 3000);

          setTimeout(() => {
            contarPedidos();
          }, 5000)

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
      //const response = await axios.post('http://192.168.1.6:8080/pedido/alterar-status', {
      const response = await axios.post('https://atende-mais.shop/pedido/alterar-status', {
        pedidoId: pedidoId,
        novoStatus: novoStatus,
        hora: hora // Enviando o timestamp junto com o pedidoId
      },
        {
          withCredentials: true // Configuração deve ser um terceiro parâmetro
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
        <nav>
          <ul class="menu">
            <li><a href="/entregues">Entregues</a></li>
            <li><a href="/prefixo">Prefixos</a></li>
          </ul>
        </nav>
      </header>

      <div className="imagem-titulo-home"></div>

      <div className="container-contador">
        <div className="pedidos-lista-celular">
          {error ? (
            <p>{error}</p>
          ) : (
            <ul className="ul-pedidos-celular">
              {contagem.map((item, index) => (
                <li className="li-pedidos-celular" key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="pedido-container">
        {pedidos.length === 0 ? (
          <p className="mensagem-sem-pedidos">Ainda não há pedidos</p>
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
                  <h2 className="senhaTexto3" style={{fontSize: '16px' }}>Senha</h2>
                  <h1 className="senha3" style={{fontSize: '25px' }}>{pedido.reference_id}</h1>
                </div>
                <div className="checkbox-detalhes"><p className="texto-checkbox">Pronto</p>
                
           <label>
       
             <input
               type="checkbox"
               className="checkbox-detalhe"
               checked={pedido.selecionado || false}
               onChange={() => toggleCheckbox(pedido.reference_id)}
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