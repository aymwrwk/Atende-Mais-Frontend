import React, { useState, useEffect } from "react";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
//import style from './Home.css'; // Certifique-se de que este caminho está correto
//import style from './Entregues.css';
import './Entregues.css'; // Remova a referência a 'default'


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

  // Função para buscar pedidos do backend
  const buscarPedidos = async () => {
    try {
      const response = await axios.get('https://atende-mais.shop/pedido/entregues'); // Chamada ao endpoint
      //const response = await axios.get('http://localhost:8080/pedido/entregues'); 
      setPedidos(response.data); // Atualiza o estado com os dados dos pedidos
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
        //const response = await axios.post('http://localhost:8080/pedido/alterar-status', {
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
      <div className="main-container-menu">
        <div className="container-menu">
    <h1 className="titulo-pagina-entregues">Entregues</h1>
          <div className={classOn ? 'menu-section on' : 'menu-section'} onClick={() => setClassOn(!classOn)}>
            <div className="menu-toggle">
              <div className="one"></div>
              <div className="two"></div>
              <div className="three"></div>
            </div>
            <nav>
              <ul>
                <li>
                  <a href="/home">Home</a>
                </li>
                <li>
                  <a href="/prefixos">Prefixos</a>
                </li>
                <li>

                </li>


              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="titl">
      <div className="imagem-titulo">

        </div>
      </div>
      <div className="container-contadorr">

      </div>
      <ul>
        {pedidos && pedidos.map((pedido, index) => {
          const statusClass = statusMap[pedido.status.toLowerCase()] || '';

          return (

            <div className="conteudo-wrapper" key={pedido.reference_id}>

              <div className="checkbox-container">


                <label>

                  <h1 className="texto-prontoo">Pronto</h1>
                  <br />

                  <input
                    type="checkbox"
                    className="checkbox-prontoo"
                    checked={pedido.status === 'pronto'}
                    onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'pronto' ? 'andamento' : 'pronto')}
                  />



                </label>



                <label>
                  <br />


                  <input
                    type="checkbox"
                    className="checkbox-cancelarr"
                    checked={pedido.status === 'cancelar'}
                    onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'cancelar' ? 'pronto' : 'cancelar')}
                  />


                  <h1 className="texto-cancelarr">Cancelar</h1>

                </label>

                <br />
              
                <label>
                  <h1 className="texto-entreguee">Entregue</h1>
                  <br />

                  <input
                    type="checkbox"
                    className="checkbox-entreguee"
                    checked={pedido.status === 'entregue'}
                    onChange={() => alterarStatus(pedido.reference_id, pedido.hora, pedido.status === 'entregue' ? 'pronto' : 'entregue')}
                  />



                </label>

                <br />





              </div>




              <div className="conteudoo">

                <li>
                  <div className="pedido-container">
                    <h2 className="quantidadeTexto">Quantidade</h2>
                    <h2 className="quantidade">{pedido.quantity}</h2>
                    <div className="div-descricaoo">
                      <h3 className="descricaoo">{pedido.description}</h3>
                    </div>

                    <h1 className="hora">{pedido.hora}</h1>
                    <h1 className="horario-texto">Horário</h1>
                    <h1 className="senhTextoo">Senha</h1>
                    <h1 className="senhaa">{pedido.reference_id}</h1>

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

    </div>
  );

};

export default Entregues;
