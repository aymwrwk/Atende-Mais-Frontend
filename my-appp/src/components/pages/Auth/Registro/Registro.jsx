import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services';
import './Registro.css';

const Registro = ({ onLoginSuccess }) => {
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
      // Usar o authService para registrar
      const userData = {
        name: name,         // campo "name" conforme esperado
        telefone: phone,    // campo "telefone"
        email: email,
        password: password
      };
      
      // Como o endpoint de registro pode ser diferente, ainda usamos axios direto
      // Em uma versão futura, considere adicionar um método específico no authService
      const response = await authService.register(userData);

      // Armazena o nome (ou outro identificador) no localStorage
      localStorage.setItem('username', name);
      if (onLoginSuccess) {
        onLoginSuccess(name);
        console.log("Registro realizado com sucesso! Redirecionando para /inicio");
        navigate('/inicio');
      }
      console.log("Registro realizado com sucesso!");
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