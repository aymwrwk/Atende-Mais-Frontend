import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registro.css';


const Registro = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
  <body>
    <div className='header-login-azul'>
      <div className='register-container'>
        <h1 className='register-title'>Registro</h1>
        <form onSubmit={handleSubmit} className='register-form'>
          <div className='register-input-container'>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='register-input'
              placeholder="E-mail"
            />
          </div>
          <div className='register-input-container'>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className='register-input'
              placeholder="Número de telefone"
            />
          </div>
          <div className='register-input-container'>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='register-input'
              placeholder="Senha"
            />
          </div>
          <div className='register-input-container'>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='register-input'
              placeholder="Senha"
            />
          </div>
          <button type="submit" className='register-button'>Registrar</button>
          {error && <p className='register-error'>{error}</p>}
        </form>
      </div>
    </div>
  </body>
);
};

export default Registro;