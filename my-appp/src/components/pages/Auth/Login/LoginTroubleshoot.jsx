import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Componente para diagnóstico de problemas de login
 * Testa várias configurações para identificar o problema
 */
const LoginTroubleshoot = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Limpa headers e localStorage para testes limpos
  const resetEnvironment = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Adiciona um resultado de teste ao log
  const addResult = (testName, status, message, data = null) => {
    setResults(prev => [
      ...prev,
      { 
        id: Date.now(), 
        testName, 
        status, 
        message, 
        data,
        timestamp: new Date().toLocaleTimeString() 
      }
    ]);
  };

  // Testa o login com diferentes configurações
  const runTests = async () => {
    setIsLoading(true);
    setResults([]);
    resetEnvironment();

    try {
      // Teste 1: Login direto com axios (como no código antigo)
      try {
        addResult('Teste 1', 'info', 'Iniciando teste com axios direto (código antigo)');
        
        const response1 = await axios.post(
          'https://atende-mais.shop:8080/api/v1/auth/login',
          { email, password }
        );
        
        addResult(
          'Teste 1', 
          'success', 
          'Login bem-sucedido com axios direto!', 
          { status: response1.status, token: response1.data.token?.substring(0, 10) + '...' }
        );
        
        resetEnvironment();
      } catch (err1) {
        addResult(
          'Teste 1', 
          'error', 
          `Falha no login com axios direto: ${err1.message}`, 
          { 
            status: err1.response?.status, 
            data: err1.response?.data,
            headers: err1.response?.headers
          }
        );
      }

      // Teste 2: Login com withCredentials
      try {
        addResult('Teste 2', 'info', 'Iniciando teste com withCredentials=true');
        
        const response2 = await axios.post(
          'https://atende-mais.shop:8080/api/v1/auth/login',
          { email, password },
          { withCredentials: true }
        );
        
        addResult(
          'Teste 2', 
          'success', 
          'Login bem-sucedido com withCredentials!', 
          { status: response2.status, token: response2.data.token?.substring(0, 10) + '...' }
        );
        
        resetEnvironment();
      } catch (err2) {
        addResult(
          'Teste 2', 
          'error', 
          `Falha no login com withCredentials: ${err2.message}`, 
          { 
            status: err2.response?.status, 
            data: err2.response?.data 
          }
        );
      }

      // Teste 3: Login com headers personalizados
      try {
        addResult('Teste 3', 'info', 'Iniciando teste com headers personalizados');
        
        const response3 = await axios.post(
          'https://atende-mais.shop:8080/api/v1/auth/login',
          { email, password },
          { 
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            } 
          }
        );
        
        addResult(
          'Teste 3', 
          'success', 
          'Login bem-sucedido com headers personalizados!', 
          { status: response3.status, token: response3.data.token?.substring(0, 10) + '...' }
        );
        
        resetEnvironment();
      } catch (err3) {
        addResult(
          'Teste 3', 
          'error', 
          `Falha no login com headers personalizados: ${err3.message}`, 
          { 
            status: err3.response?.status, 
            data: err3.response?.data 
          }
        );
      }

    } catch (err) {
      addResult('Geral', 'error', `Erro geral nos testes: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 font-montserrat">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Login</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Seu email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Sua senha"
            />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={runTests}
            disabled={isLoading || !email || !password}
            className={`px-4 py-2 rounded font-medium ${
              isLoading || !email || !password
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Executando...' : 'Executar Testes'}
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-gray-200 rounded font-medium hover:bg-gray-300"
          >
            Voltar para Login
          </button>
          
          <button
            onClick={() => navigate('/api-test')}
            className="px-4 py-2 bg-indigo-500 text-white rounded font-medium hover:bg-indigo-600"
          >
            Testar API
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Resultados ({results.length})</h2>
        
        {results.length === 0 ? (
          <p className="text-gray-500 italic">Nenhum teste executado ainda.</p>
        ) : (
          <div className="space-y-4">
            {results.map(result => (
              <div 
                key={result.id}
                className={`p-3 rounded-lg border ${
                  result.status === 'success' ? 'border-green-200 bg-green-50' :
                  result.status === 'error' ? 'border-red-200 bg-red-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{result.testName}</span>
                    <span className="text-xs text-gray-500 ml-2">({result.timestamp})</span>
                  </div>
                  <span 
                    className={`text-xs px-2 py-1 rounded-full ${
                      result.status === 'success' ? 'bg-green-100 text-green-800' :
                      result.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {result.status.toUpperCase()}
                  </span>
                </div>
                
                <p className="mt-1 text-sm">{result.message}</p>
                
                {result.data && (
                  <pre className="mt-2 text-xs p-2 bg-gray-800 text-white rounded overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginTroubleshoot; 