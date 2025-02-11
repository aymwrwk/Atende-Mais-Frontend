import React, { useState } from 'react';
import axios from 'axios';
import './Credenciais.css';

const UpdateEmailAndToken = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      //const response = await axios.post('https://atende-mais.shop/auth/credenciais', null, {
      const response = await axios.post('http//192.168.1.6:8080/auth/credenciais', null, {
        params: {
          email: email,
          token: token
        },
        withCredentials: true
      })
      setMessage(response.data);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data);
      } else {
        setMessage('Erro ao conectar com o servidor.');
      }
    }
  }

    return (
      <div className='div-main-credenciais'>
        <h2 className='h2-titulo-credenciais'>Atualizar Email e Token</h2>
        <form className='form-credenciais' onSubmit={handleSubmit}>
          <div className='input-email-credenciais'>

            <input className='credenciais-email'
              type="email"
              value={email} placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='input-senha-credenciais'>

            <input className='input-credenciais-senha'
              type="text"
              value={token} placeholder='Token'
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
          <button className='button-credenciais' type="submit">Atualizar</button>
        </form>
        
        {message && <p>{message}</p>}
      </div>
    );
  };

  export default UpdateEmailAndToken;