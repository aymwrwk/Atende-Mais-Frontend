import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import styles from './Loginpage.css'; // Certifique-se de que este caminho está correto
import './Loginpage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha
  const navigate = useNavigate();

 /* const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simula o login bem-sucedido independentemente das credenciais
      // No futuro, substitua isso pelo código real de autenticação
      navigate('/home'); // Redirecionar para a página inicial
    } catch (error) {
      setError('Erro ao realizar login');
    }
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('https://atende-mais.shop/auth/login', null, {
          //const response = await axios.post('http://192.168.1.6:8080///auth/login', null, {  
        params: {
                username: username,
                password: password
            },
            withCredentials: true
        });

        if (response.status === 200) {
            localStorage.setItem('username', username);
            if (onLoginSuccess) {
                onLoginSuccess(username); // Chama a função somente se ela existir
                console.log("Login realizado com sucesso! Redirecionando para /home");
                navigate('/home'); // Redireciona para a rota /home
            }
            console.log("Login realizado com sucesso!");
        }
    } catch (err) {
        console.error("Erro ao fazer login:", err);
        setError("Credenciais inválidas");
    }
};

  return (
    <body className='header-login-azul'>
      <div className='container-login'>
        <h1 className='title-principal-login'>Login</h1>
      
        <form onSubmit={handleSubmit} className='form'>
        <div className='inputContainer'>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
    </body>
  );
};

export default LoginPage;
