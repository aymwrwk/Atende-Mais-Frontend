import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import style from './Prefixos.css'; // Certifique-se de que este caminho está correto
import './Prefixos.css'; 

const GerenciarPrefixos = () => {
  //const [prefixos, setPrefixos] = useState(['ABC', 'DEF', 'GHI']); // Dados estáticos simulados

  const [prefixos, setPrefixos] = useState([]);
  const [novoPrefixo, setNovoPrefixo] = useState('');
  const [error, setError] = useState(null);

  // Função para buscar os prefixos existentes
  const fetchPrefixos = async () => {
    try {
      const response = await axios.get('https://atende-mais.shop/prefixos/buscar-prefixo');
     // const response = await axios.get('http://localhost:8080/prefixos/buscar-prefixo');
      const data = response.data; // A resposta já deve ser uma lista de strings
      console.log('Dados recebidos da API:', data); // Verificar o formato da resposta
      setPrefixos(data); // Define a lista diretamente no estado
    } catch (err) {
      setError('');
    }
  };

  useEffect(() => {
    fetchPrefixos();
  }, []);

  // Função para adicionar um novo prefixo
  const adicionarPrefixo = async () => {
    if (!novoPrefixo) {
      setError('');
      return;
    }

    try {
      await axios.post('https://atende-mais.shop/prefixos/adicionar-prefixo', { prefixo: novoPrefixo });
     // await axios.post('http://localhost:8080/prefixos/adicionar-prefixo', { prefixo: novoPrefixo });
      setNovoPrefixo(''); // Limpa o campo de entrada
      setError(null); // Reseta o erro
      fetchPrefixos(); // Atualiza a lista de prefixos
    } catch (err) {
      setError('');
    }
  };

  // Função para excluir um prefixo
  /*const excluirPrefixo = async (prefixo) => {
    try {
      await axios.delete('http://191.101.70.241:8080/prefixos/excluir-prefixo', { prefixo: prefixo });
      //await axios.delete('http://localhost:8080/prefixos/excluir-prefixo', { prefixo });
      setError(null); // Reseta o erro
      fetchPrefixos(); // Atualiza a lista de prefixos
    } catch (err) {
      setError('');
    }
  };*/

  const excluirPrefixo = async (prefixo) => {
    try {
      // Enviando o corpo corretamente como "prefixo": "Batata"
      await axios.delete('https://atende-mais.shop/prefixos/excluir-prefixo', {
        data: { prefixo }
      });
      setError(null); // Reseta o erro
      fetchPrefixos(); // Atualiza a lista de prefixos
    } catch (err) {
      setError('Erro ao excluir o prefixo');
    }
  };  

  const [classOn, setClassOn] = useState(false);

  return (
    <div className="header-prefixos">
      <div className="main-container-menu-prefixos">
        <div className="container-menu-prefixos">

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
                  <a href="/entregues">Entregues</a>
                </li>
                <li>

                </li>


              </ul>
            </nav>
          </div>
        </div>
      </div>






      <div className="imagem-titulo">

      </div>
      <h1 className='h1-principal'>Gerenciar Prefixos</h1>
      <p className='descricao-titulo'>Os prefixos são as primeiras palavras de um produto. Por exemplo, em <strong>Jantinha</strong> com Espeto de Cupim, o prefixo é <strong>Jantinha</strong>; e em Batata Simples, o prefixo é <strong>Batata</strong>. Eles servem para agrupar e organizar itens semelhantes, facilitando a identificação e categorização.</p>
      <h1 className='h1-principal2'>Adicionar Prefixos</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe mensagem de erro se houver */}
      <div className=''>
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
        <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#E5E5E">
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </button>
    </li>
  ))}
</ul>
      </div>
    </div>
  );
};

export default GerenciarPrefixos;
