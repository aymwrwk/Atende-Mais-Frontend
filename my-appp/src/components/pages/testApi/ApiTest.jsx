import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../utils/config';

const ApiTest = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Registra um resultado de teste
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

  // Executa testes de ping na API
  const runApiTests = async () => {
    setIsLoading(true);
    setResults([]);

    try {
      // Teste de conectividade básica
      addResult('Conectividade', 'info', 'Testando conectividade básica com a API');
      
      try {
        const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
        addResult(
          'Conectividade', 
          'success', 
          'Conectividade básica OK!', 
          { status: response.status, data: response.data }
        );
      } catch (err) {
        addResult(
          'Conectividade', 
          'error', 
          `Falha na conectividade básica: ${err.message}`, 
          { 
            status: err.response?.status, 
            data: err.response?.data,
            error: err.message
          }
        );
        
        // Tenta uma alternativa mais simples
        try {
          const options = {
            method: 'GET',
            url: `${API_BASE_URL}/health`,
            timeout: 5000
          };
          
          addResult('Fetch alternativo', 'info', 'Tentando fetch alternativo');
          const fetchResponse = await fetch(`${API_BASE_URL}/health`, { 
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
          });
          
          if (fetchResponse.ok) {
            const data = await fetchResponse.text();
            addResult(
              'Fetch alternativo', 
              'success', 
              'Fetch alternativo bem-sucedido!', 
              { status: fetchResponse.status, data }
            );
          } else {
            addResult(
              'Fetch alternativo', 
              'error', 
              `Falha no fetch alternativo: ${fetchResponse.statusText}`, 
              { status: fetchResponse.status }
            );
          }
        } catch (fetchErr) {
          addResult(
            'Fetch alternativo', 
            'error', 
            `Erro no fetch alternativo: ${fetchErr.message}`
          );
        }
      }

      // Teste CORS simples sem credenciais
      addResult('CORS', 'info', 'Testando problemas de CORS');
      
      try {
        const corsResponse = await axios.options(`${API_BASE_URL}/auth/login`, {
          headers: {
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'content-type'
          }
        });
        
        addResult(
          'CORS', 
          'success', 
          'Pré-requisição CORS bem-sucedida!', 
          { 
            status: corsResponse.status,
            headers: {
              'access-control-allow-origin': corsResponse.headers['access-control-allow-origin'],
              'access-control-allow-methods': corsResponse.headers['access-control-allow-methods'],
              'access-control-allow-headers': corsResponse.headers['access-control-allow-headers']
            }
          }
        );
      } catch (corsErr) {
        addResult(
          'CORS', 
          'error', 
          `Falha na pré-requisição CORS: ${corsErr.message}`, 
          { 
            status: corsErr.response?.status,
            headers: corsErr.response?.headers,
            error: corsErr.message
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
      <h1 className="text-2xl font-bold mb-6">Teste de API</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <div className="flex space-x-4">
          <button
            onClick={runApiTests}
            disabled={isLoading}
            className={`px-4 py-2 rounded font-medium ${
              isLoading 
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Executando...' : 'Testar Conectividade'}
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-gray-200 rounded font-medium hover:bg-gray-300"
          >
            Voltar para Login
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

export default ApiTest; 