import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import styles from './Loginpage.css'; // Certifique-se de que este caminho está correto
import './Loginpage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://atende-mais.shop:8080/api/v1/auth/login',
        { email, password }  // enviando os dados no corpo da requisição
      );

      if (response.status === 200) {
        const token = response.data.token;
        // Armazena o token no localStorage para uso posterior
        localStorage.setItem('token', token);
        // (Opcional) Define o header Authorization default para todas as requisições axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        if (onLoginSuccess) {
          onLoginSuccess(email);
          console.log("Login realizado com sucesso!");
        }
        console.log("Login realizado com sucesso!");
        navigate('/inicio');
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Credenciais inválidas");
    }
  };

  return (
    <body className='body-login'>
      <div className='bg-login'>
        <div className='container-login'>
          <h1 className='title-principal-login'>Login</h1>
          <form onSubmit={handleSubmit} className='form'>
            <div className='inputContainer'>
              <input
                type="text"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
                className='input'
                placeholder="Usuário"
              />
            </div>
            <div className='inputContainer'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='input'
                placeholder="Senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className='togglePassword'
              >
                {/* ícone do olho */}
              </button>
            </div>
            <button type="submit" className='button'>Login</button>
            {error && <p className='error'>{error}</p>}
          </form>
        </div>
      </div>
    </body>
  );
};

export default LoginPage;
