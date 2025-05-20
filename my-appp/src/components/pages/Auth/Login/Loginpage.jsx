import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services';
import { TIME_CONFIG } from '../../../../utils/config';
// Estilos customizados para o componente de login
import './LoginStyles.css';
// Import direto da imagem de fundo
import backgroundImage from '../../../../assets/imgs/login-bg.png';

// Estilo inline para garantir que a fonte seja aplicada
const fontStyle = {
  fontFamily: "'Montserrat', sans-serif"
};

// Estilo adicional para garantir o carregamento da imagem de fundo
const backgroundStyle = {
  ...fontStyle,
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
};

const LoginPage = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const clearError = useCallback(() => {
    if (error) setError('');
  }, [error]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    clearError();

    const { email, password } = credentials;

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      // Usando o serviço de autenticação em vez do axios direto
      const data = await authService.login(email, password);
      
      if (data) {
        if (onLoginSuccess) {
          onLoginSuccess(email);
        }

        console.log("Login realizado com sucesso!");
        navigate('/inicio');
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError(err.response?.data?.message || "Credenciais inválidas");
    }
  }, [credentials, clearError, navigate, onLoginSuccess]);

  return (
    <div className="font-montserrat min-h-screen flex flex-col justify-center items-center px-6 py-12 login-background overflow-visibe" style={backgroundStyle}>
      <div className="login-content w-full max-w-sm text-center mb-8">
        <img
          alt="Sua Empresa"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-black overflow-visible" style={fontStyle}>
          Entre em sua conta
        </h2>
      </div>

      <div className="login-content w-full max-w-sm">
        {/* Container para o fundo e o formulário */}
        <div className="relative overflow-visible rounded-lg">
          {/* Div de fundo cinza com opacidade e blur */}
          <div className="absolute inset-0 p-10 bg-gray-100 bg-opacity-95 rounded-lg shadow-xl"></div>
          
          {/* Conteúdo do formulário */}
          <div className="relative z-10 p-8" style={fontStyle}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900" style={fontStyle}>
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={credentials.email}
                    onChange={handleInputChange}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                    style={{fontStyle, fontWeight:500}}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-900" style={fontStyle}>
                    Senha
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500" style={fontStyle}>
                      Esqueceu a senha?
                    </a>
                  </div>
                </div>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                    style={{fontStyle, fontWeight:500}}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    style={{fontStyle, fontWeight:700, fontSize:13}}
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2" style={fontStyle}>
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  style={fontStyle}
                >
                  Entrar
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500" style={fontStyle}>
              Não é membro?{' '}
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500" style={fontStyle}>
                Comece um período de teste gratuito de 30 dias
              </a>
            </p>
            {/*
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/login-debug')}
                className="text-xs text-gray-500 hover:text-indigo-600"
              >
                Diagnóstico de Login
              </button>
            </div>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;