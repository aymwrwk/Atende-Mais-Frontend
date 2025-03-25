import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import style from './Prefixos.css'; // Certifique-se de que este caminho está correto
import './Prefixos.css';
import Header from "./Header";

const GerenciarPrefixos = () => {
  //const [prefixos, setPrefixos] = useState(['ABC', 'DEF', 'GHI']); // Dados estáticos simulados

  const [prefixos, setPrefixos] = useState([]);
  const [novoPrefixo, setNovoPrefixo] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetchPrefixos();
    } else {
      setError('Faça login primeiro'); // Redirecione para login se necessário
    }
  }, [localStorage.getItem('token')]); // Recarrega quando o token mudar

  const fetchPrefixos = async () => {
    try {
      // Obter o token do localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Usuário não autenticado');
        return;
      }

      const response = await axios.get('https://atende-mais.shop:8080/api/v1/prefixos/buscar-prefixo',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Verifique a estrutura da resposta (ajuste conforme seu backend)
      console.log("Resposta da API:", response.data);
      setPrefixos(response.data); // Ou response.data.prefixos se for um objeto

    } catch (err) {
      console.error("Erro detalhado:", err.response); // Log detalhado
      setError('Erro ao buscar prefixos');
    }
  };

  fetchPrefixos;

  const adicionarPrefixo = async () => {
    if (!novoPrefixo) {
      setError('Prefixo não pode ser vazio');
      return;
    }

    try {
      // Recupera o token armazenado
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado');
        return;
      }

      await axios.post(
        'https://atende-mais.shop:8080/api/v1/prefixos/adicionar-prefixo',
        { prefixo: novoPrefixo },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      setNovoPrefixo('');
      setError(null);
      fetchPrefixos();
    } catch (err) {
      setError('Erro ao adicionar prefixo');
      console.error(err);
    }
  };

  const excluirPrefixo = async (prefixo) => {
    try {
      await axios.delete('https://atende-mais.shop:8080/api/v1/prefixos/excluir-prefixo', {
        data: { prefixo },
        headers: {
          // Se o endpoint de delete também exigir autenticação, inclua o token
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setError(null);
      fetchPrefixos();
    } catch (err) {
      setError('Erro ao excluir o prefixo');
    }
  };

  return (
    <div className="">
      <header class="header-menu">
        <Header />
        <div className="random-div">
          <p className="p-header-center">
            Início
          </p>
        </div>
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
      <h1 className='titulo-pagina-prefixos'>Gerenciar Prefixos</h1>
      <p className='descricao-titulo'>Os prefixos são as primeiras palavras de um produto. Por exemplo, em <strong>Jantinha</strong> com Espeto de Cupim, o prefixo é <strong>Jantinha</strong>; e em Batata Simples, o prefixo é <strong>Batata</strong>. Eles servem para agrupar e organizar itens semelhantes, facilitando a identificação e categorização.</p>
      <div className='conatiner-main-prefixos'>
        <h1 className='h1-principal2'>Adicionar Prefixos</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe mensagem de erro se houver */}
        <div className='conteiner-adicionar-prefixos'>
          <input
            className='input-prefixoo'
            type="text"
            value={novoPrefixo}
            onChange={(e) => setNovoPrefixo(e.target.value)}
            placeholder="Digite um novo prefixo"
          />
          <button className='button-adicionar-prefixoo' onClick={adicionarPrefixo}>Adicionar</button>
        </div>
        <div className='lista-containerr'>
          <ul className='vertical-listt'>
            {prefixos.map((item, index) => (
              <li className='lii' key={index}>
                <span className='prefixo-textoo'>{item.prefixo}</span> {/* Acessa o valor da chave 'prefixo' */}
                <button className='excluir-prefixoo' onClick={() => excluirPrefixo(item.prefixo)}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#00000">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GerenciarPrefixos;