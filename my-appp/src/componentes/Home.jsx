import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Home.css';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';

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

  // Configurações para evitar cache de respostas
  /*axios.defaults.headers.common['Cache-Control'] = 'no-cache';
  axios.defaults.headers.common['Pragma'] = 'no-cache';
  axios.defaults.headers.common['Expires'] = '0';*/

  /*const statusClassMap = {
    'pronto': 'status-pronto',
    'andamento': 'status-andamento',
    'entregue': 'status-entregue',
    'cancelar': 'status-cancelar',
  };*/

  /*const buscarPedidos = async () => {
    try {
      const response = await axios.get('http://191.101.70.241:8080/pedido/lista-pedidos');
      setPedidos(response.data);
    } finally {
      setLoading(false);
    }
  };

  const contarPedidos = async () => {
    try {
      const response = await axios.get('http://191.101.70.241:8080/pedido/contar');
      setContagem(response.data);
    } catch (error) {
      console.error("Erro ao contar pedidos:", error.response ? error.response.data : error.message);
      alert("Erro ao contar pedidos: " + (error.response ? error.response.data : error.message));
    }
  };

  useEffect(() => {
    buscarPedidos();
    contarPedidos();
  }, []);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://191.101.70.241:8080/ws-notifications'),
      onConnect: () => {
        console.log("Conectado ao WebSocket");
        client.subscribe('/topic/notifications', (message) => {
          console.log("Notificação recebida:", message.body);
          setTimeout(() => buscarPedidos(), 5000);
          setTimeout(() => contarPedidos(), 7000);
        });
      },
      onDisconnect: () => {
        console.log("Desconectado do WebSocket");
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

  if (loading) {
    return <h1>Carregando pedidos...</h1>;
  }

  const alterarStatus = async (pedidoId, hora, novoStatus) => {
    try {
      const response = await axios.post('http://191.101.70.241:8080/pedido/alterar-status', {
        pedidoId,
        novoStatus,
        hora,
      }, {
        withCredentials: true,
      });

      console.log('Resposta do servidor:', response.data);
      const pedidosAtualizados = pedidos.map(pedido =>
        pedido.reference_id === pedidoId && pedido.hora === hora
          ? { ...pedido, status: novoStatus }
          : pedido
      );
      setPedidos(pedidosAtualizados);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };
*/

// Função para buscar pedidos do backend
/*const buscarPedidos = async () => {
  try {
    const response = await axios.get('http://191.101.70.241:8080/pedido/lista-pedidos', { withCredentials: true });
    //const response = await axios.get('http://localhost:8080/pedido/lista-pedidos'); // Chamada ao endpoint
    setPedidos(response.data); // Atualiza o estado com os dados dos pedidos
  } finally {
    setLoading(false); // Atualiza o estado de carregamento
  }
};*/

 // Função para buscar pedidos do backend
 const buscarPedidos = async () => {
  try {
    //const response = await axios.get('https://191.101.70.241:8080/pedido/lista-pedidos', { withCredentials: true });
    const response = await axios.get('https://atende-mais.shop/pedido/lista-pedidos', { withCredentials: true });
    setPedidos(response.data); // Atualiza o estado com os dados dos pedidos
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
    setContagem(response.data);
  } catch (error) {
    console.error("Erro ao contar pedidos:", error.response ? error.response.data : error.message);
    alert("Erro ao contar pedidos: " + (error.response ? error.response.data : error.message));
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
    webSocketFactory: () => new SockJS('https://atende-mais.shop/wss-notifications'),
    onConnect: () => {
      console.log("Conectado ao WebSocket");
      client.subscribe('/topic/notifications', (message) => {
        console.log("Notificação recebida:", message.body);

        // Adiciona um atraso de 5 segundos antes de chamar buscarPedidos
        setTimeout(() => {
          buscarPedidos();  
        }, 3000);

        setTimeout(()=>{
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
    <div className="main-container-menu">
      <div className="container-menu">
        <div className={classOn ? 'menu-section on' : 'menu-section'} onClick={() => setClassOn(!classOn)}>
          <div className="menu-toggle">
            <div className="one"></div>
            <div className="two"></div>
            <div className="three"></div>
          </div>
          
          <nav>
            <ul>
              <li><a href="/entregues">Entregues</a></li>
              <li><a href="/prefixos">Prefixos</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <div className="imagem-titulo-home"></div>
    <h1 className="titulo-pagina">Home</h1>

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
        <p className="mensagem-sem-pedidos">Ainda não há pedidos</p> // Estilize conforme necessário
      ) : (
        <ul>
          {pedidos.map((pedido, index) => {
            const statusClass = statusMap[pedido.status.toLowerCase()] || '';

            return (
              <div className="conteudo-wrapper" key={index}>
                <div className="checkbox-container">
                  <label>
                    <h1 className="texto-entregue">Entregue</h1>
                    <input
                      type="checkbox"
                      className="checkbox-entregue"
                      checked={pedido.status === 'entregue'}
                      onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'entregue' ? 'pronto' : 'entregue')}
                    />
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      className="checkbox-cancelar"
                      checked={pedido.status === 'cancelar'}
                      onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'cancelar' ? 'pronto' : 'cancelar')}
                    />
                    <h1 className="texto-cancelar">Cancelar</h1>
                  </label>
                </div>

                <div className="conteudo">
                  <label>
                    <h1 className="texto-pronto">Pronto</h1>
                    <input
                      type="checkbox"
                      className="checkbox-pronto"
                      checked={pedido.status === 'pronto'}
                      onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'pronto' ? 'andamento' : 'pronto')}
                    />
                  </label>

                  <li>
                    <div className="pedido-container">
                      <h2 className="quantidadeTexto">Quantidade</h2>
                      <h2 className="quantidade">{pedido.quantity}</h2>
                      <div className="div-descricao">
                        <h3 className="descricao">{pedido.description}</h3>
                      </div>
                      <h1 className="senhTexto">Senha</h1>
                      <h1 className="senha">{pedido.reference_id}</h1>
                    </div>
                    <div className="status-container">
                      <div className={`status-indicator ${statusClass}`}></div>
                    </div>
                  </li>
                </div>
              </div>
            );
          })}
        </ul>
      )}
    </div>

    <div className="container-lista">
      <div className="contagem-pedidos">
        <h2 className="title-container-pedidos">Contagem de Pedidos</h2>
        <ul className="ul-pedidos">
          {contagem.map((item, index) => (
            <li className="li-pedidos" key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>

    <div className="container-lista1"></div>
  </div>
);
};

export default Home;

 /* return (
    <div className="header">
      <div className="main-container-menu">
     
        <div className="container-menu">
          <div className={classOn ? 'menu-section on' : 'menu-section'} onClick={() => setClassOn(!classOn)}>
            <div className="menu-toggle">
              <div className="one"></div>
              <div className="two"></div>
              <div className="three"></div>
            </div>
            
            <nav>
              <ul>
                <li><a href="/entregues">Entregues</a></li>
                <li><a href="/prefixos">Prefixos</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      
      <div className="imagem-titulo-home">

</div>
      <h1 className="titulo-pagina">Home</h1>
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

      <ul>
        {pedidos.map((pedido, index) => {
          const statusClass = statusMap[pedido.status.toLowerCase()] || '';

          return (
            <div className="conteudo-wrapper" key={index}>
              <div className="checkbox-container">
                <label>
                  <h1 className="texto-entregue">Entregue</h1>
                  <input
                    type="checkbox"
                    className="checkbox-entregue"
                    checked={pedido.status === 'entregue'}
                    onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'entregue' ? 'pronto' : 'entregue')}
                  />
                </label>

                <label>
                  <input
                    type="checkbox"
                    className="checkbox-cancelar"
                    checked={pedido.status === 'cancelar'}
                    onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'cancelar' ? 'pronto' : 'cancelar')}
                  />
                  <h1 className="texto-cancelar">Cancelar</h1>
                </label>
              </div>

              <div className="conteudo">
                <label>
                  <h1 className="texto-pronto">Pronto</h1>
                  <input
                    type="checkbox"
                    className="checkbox-pronto"
                    checked={pedido.status === 'pronto'}
                    onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'pronto' ? 'andamento' : 'pronto')}
                  />
                </label>

                <li>
                  <div className="pedido-container">
                    <h2 className="quantidadeTexto">Quantidade</h2>
                    <h2 className="quantidade">{pedido.quantity}</h2>
                    <div className="div-descricao">
                      <h3 className="descricao">{pedido.description}</h3>
                    </div>
                    <h1 className="senhTexto">Senha</h1>
                    <h1 className="senha">{pedido.reference_id}</h1>
                  </div>
                  <div className="status-container">
                    <div className={`status-indicator ${statusClass}`}></div>
                  </div>
                </li>
              </div>
            </div>
          );
        })}
      </ul>

      <div className="container-lista">
        
        <div className="contagem-pedidos">
          
          <h2 className="title-container-pedidos">Contagem de Pedidos</h2>
          
          <ul className="ul-pedidos">
            {contagem.map((item, index) => (
              <li className="li-pedidos" key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-lista1"></div>
    </div>
  );
};

export default Home;*/