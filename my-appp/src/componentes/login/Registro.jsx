import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registro.css';

const Registro = ({ onLoginSuccess }) => {
  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Será enviado como "telefone"
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples: verificar se as senhas coincidem
    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    try {
      // Envia os dados no corpo da requisição em formato JSON
      const response = await axios.post(
        'https://atende-mais.shop:8080/api/v1/auth/registrar-estabelecimento',
        {
          name: name,         // campo "name" conforme esperado
          telefone: phone,    // campo "telefone"
          email: email,
          password: password
        },
        { withCredentials: true } // se necessário para o backend
      );

      if (response.status === 201) {
        // Armazena o nome (ou outro identificador) no localStorage
        localStorage.setItem('username', name);
        if (onLoginSuccess) {
          onLoginSuccess(name);
          console.log("Registro realizado com sucesso! Redirecionando para /home");
          navigate('/inicio');
        }
        console.log("Registro realizado com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao registrar:", err);
      setError("Erro ao registrar. Verifique seus dados e tente novamente.");
    }
  };

  return (
    <div className='header-login-azul'>
      <div className='register-container'>
        <h1 className='register-title'>Registro</h1>
        <form onSubmit={handleSubmit} className='register-form'>
          {/* Campo Nome */}
          <div className='register-input-container'>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='register-input'
              placeholder="Nome"
            />
          </div>

          {/* Campo E-mail */}
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

          {/* Campo Telefone */}
          <div className='register-input-container'>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className='register-input'
              placeholder="Telefone"
            />
          </div>

          {/* Campo Senha */}
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

          {/* Campo Confirmação de Senha */}
          <div className='register-input-container'>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='register-input'
              placeholder="Confirme a Senha"
            />
          </div>

          <button type="submit" className='register-button'>Registrar</button>
          {error && <p className='register-error'>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Registro;
