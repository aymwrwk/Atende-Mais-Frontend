import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItemOrderPage.css';

const ItemOrderPage = () => {
  const [items, setItems] = useState([
    { description: 'Jantinha', quantity: 0, skewer: '', additionalSkewer: '' },
    { description: 'Jantinha', quantity: 0, skewer: '', additionalSkewer: '' },
    { description: 'Batata', quantity: 0 },
    { description: 'Batata especial', quantity: 0 },
    { description: 'Porção de disco', quantity: 0 },
    { description: 'Taboa de calabresa', quantity: 0 },
    { description: 'Taboa de carne', quantity: 0 },
  ]);
  const [password, setPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [skewerOptionsVisible, setSkewerOptionsVisible] = useState({});
  const [additionalSkewerOptionsVisible, setAdditionalSkewerOptionsVisible] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Fechar os menus ao clicar fora
  useEffect(() => {
    const handleDocumentClick = () => {
      setSkewerOptionsVisible({});
      setAdditionalSkewerOptionsVisible({});
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleQuantityChange = (index, delta) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = Math.max(0, updatedItems[index].quantity + delta);
    setItems(updatedItems);
  };

  const handleItemClick = (index) => {
    const updatedItems = [...items];
    // Para os itens que não dependem do espeto, incrementa normalmente
    if (index !== 0 && index !== 1) {
      updatedItems[index].quantity += 1;
    }
    setItems(updatedItems);
  };

  const handleSkewerSelect = (index, skewer) => {
    const updatedItems = [...items];
    // Se for o item de espeto e a quantidade for 0, ajusta para 1
    if ((index === 0 || index === 1) && updatedItems[index].quantity === 0) {
      updatedItems[index].quantity = 1;
    }
    updatedItems[index].skewer = skewer;
    const additional = updatedItems[index].additionalSkewer
      ? ` com espeto adicional ${updatedItems[index].additionalSkewer}`
      : '';
    updatedItems[index].description = `Jantinha espeto de ${skewer}${additional}`;
    setItems(updatedItems);
    // Fecha o menu de seleção de espetos
    setSkewerOptionsVisible((prev) => ({ ...prev, [index]: false }));
  };

  const handleAdditionalSkewerSelect = (index, additionalSkewer) => {
    const updatedItems = [...items];
    updatedItems[index].additionalSkewer = additionalSkewer === 'Nenhum' ? '' : additionalSkewer;
    const mainSkewer = updatedItems[index].skewer ? `espeto ${updatedItems[index].skewer}` : '';
    const additional = updatedItems[index].additionalSkewer
      ? ` + espeto adicional ${updatedItems[index].additionalSkewer}`
      : '';
    updatedItems[index].description = `Jantinha ${mainSkewer}${additional}`;
    setItems(updatedItems);
    setAdditionalSkewerOptionsVisible((prev) => ({ ...prev, [index]: false }));
  };

  const handleAdditionalSkewerClick = (index) => {
    setAdditionalSkewerOptionsVisible((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSkewerClick = (index) => {
    setSkewerOptionsVisible((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const resetOrder = () => {
    const resetItems = items.map((item) => ({
      ...item,
      quantity: 0,
      skewer: '',
      additionalSkewer: '',
      // Se preferir, você pode redefinir a descrição para o valor original
    }));
    setItems(resetItems);
    setPassword('');
    setShowConfirmation(false);
  };

  const sendOrder = async () => {
    if (!password.trim()) {
      alert('Por favor, insira uma senha.');
      return;
    }
    const itemsWithQuantity = items.filter((item) => item.quantity > 0);
    if (itemsWithQuantity.length === 0) {
      alert('Por favor, adicione ao menos um item ao pedido.');
      return;
    }

    const xmlItems = itemsWithQuantity
      .map(
        (item) => `
      <items>
        <item>
          <id>${password}</id>
          <description>${item.description}</description>
          <quantity>${item.quantity}</quantity>
          <amount>5.00</amount>
        </item>
      </items>
      `
      )
      .join('');

    if (!xmlItems) {
      alert('Por favor, adicione ao menos um item ao pedido.');
      return;
    }

    const xml = `<pedidos>${xmlItems}</pedidos>`;
    console.log('XML to be sent:', xml);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/inicio');
        return;
      }
      const response = await fetch('https://atende-mais.shop:8080/api/v1/pedido/notificacoes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/xml'
        },
        body: xml,
      });
      if (response.status === 201) {
        setSuccessMessage('pedido adicionado com sucesso');
        resetOrder();
        // Remove a mensagem após 3 segundos
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        console.error('Erro ao enviar pedido, status:', response.status);
      }
    } catch (error) {
      console.error('Error sending order:', error);
    }
  };

  return (
    // O onClick neste container é capturado pelo listener do document,
    // mas os cliques nos menus e botões chamam e.stopPropagation() para não fechar os menus
    <div style={{ padding: '20px' }}>
      {items.map((item, index) => (
        <div
          className="div-conteiner-itemorder"
          key={index}
          onClick={() => handleItemClick(index)}
        >
          <div className="descricao-item-div">
            <p className="descricao-item">{item.description}</p>
          </div>
          {(index === 0 || index === 1) && (
            <div className="testeitem" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '30px', textAlign: 'center' }}>
              <label className='espeto-div-item'  onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer', marginTop: '-40px', width:'100%' }}>
                Espeto:
                <div className='escolher-espeto'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSkewerClick(index);
                  }}
                  style={{ display: 'inline-block', marginLeft: '5px', cursor: 'pointer', color: 'blue',  }}
                >
                  {item.skewer || 'Escolher espeto'}
                </div>
              </label>
              {skewerOptionsVisible[index] && (
                <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
                  {[
                    'FRANGO COM BACON',
                    'FRANGO',
                    'CONTRA FILE',
                    'CUPIM',
                    'KAFTA DE FRANGO',
                    'KAFTA DE CARNE',
                    'CORAÇÃO',
                    'QUEIJO COALHO',
                    'PROVONOLE'
                  ].map((skewer) => (
                    <div
                      key={skewer}
                      className="menu-item"
                      onClick={() => handleSkewerSelect(index, skewer)}
                    >
                      {skewer}
                    </div>
                  ))}
                </div>
              )}

              <label className='espeto-adicional-div' onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer' }}>
                Espeto Adicional:
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdditionalSkewerClick(index);
                  }}
                  style={{ display: 'inline-block', marginLeft: '10px', cursor: 'pointer', color: 'blue' , marginTop: '-2px', fontSize: '15px' }}
                >
                  {item.additionalSkewer || 'Escolher espeto adicional'}
                </div>
              </label>
              {additionalSkewerOptionsVisible[index] && (
                <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
                  {[
                    'Nenhum',
                    'FRANGO COM BACON',
                    'FRANGO',
                    'CONTRA FILE',
                    'CUPIM',
                    'KAFTA DE FRANGO',
                    'KAFTA DE CARNE',
                    'CORAÇÃO',
                    'QUEIJO COALHO',
                    'PROVONOLE'
                  ].map((option) => (
                    <div
                      key={option}
                      className="menu-item"
                      onClick={() => handleAdditionalSkewerSelect(index, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className='div-botoes-mais-menos' style={{ marginTop: '10px', marginBottom: '-20px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(index, -1);
              }}
            >
              -
            </button>
            <span style={{ margin: '5px', fontSize: '25px', color: 'red' }}>{item.quantity}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(index, 1);
              }}
            >
              +
            </button>
          </div>
        </div>
      ))}
      <div className="top-bar">
        <input
          type="number"
          placeholder="Senha"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          style={{ marginLeft: '24%', padding: '7px', marginTop: '20px' }}
        />
        <button
          onClick={() => setShowConfirmation(true)}
          style={{
            marginLeft: '130px',
            padding: '10px',
            backgroundColor: '#017BFF',
            border: 'none',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    
          }}
        >
          Enviar Pedido
        </button>
      </div>

      {showConfirmation && (
        <div className="confirmacao-pedido">
          <div style={{ backgroundColor: 'white', padding: '60px', borderRadius: '5px' }}>
            <h4 className="h4-confirmacao-do-pedido">Confirmação do Pedido</h4>
            <ul>
              {items
                .filter((item) => item.quantity > 0)
                .map((item, index) => (
                  <li
                    key={index}
                    style={{ padding: '20px', fontSize: '20px', fontWeight: 'bolder' }}
                  >
                    {`${item.quantity}x ${item.description}`}
                  </li>
                ))}
            </ul>
            <div>
              <strong className="h4-senha-do-pedido">Senha do Pedido:</strong>
              <span
                style={{
                  marginLeft: '10px',
                  fontSize: '28px',
                  fontWeight: 'bolder',
                  color: 'red'
                }}
              >
                {password}
              </span>
            </div>
            <br />
            <br />
            <button
              style={{
                marginLeft: '55px',
                padding: '10px',
                backgroundColor: '#0c8d39',
                border: 'none',
                borderRadius: '7px',
                color: 'white'
              }}
              onClick={async () => {
                await sendOrder();
                // O resetOrder() já é chamado dentro do sendOrder em caso de sucesso
              }}
            >
              Sim
            </button>
            <button
              style={{
                marginLeft: '50px',
                padding: '10px',
                backgroundColor: '#b40f35',
                border: 'none',
                borderRadius: '7px',
                color: 'white'
              }}
              onClick={() => setShowConfirmation(false)}
            >
              Não
            </button>
          </div>
        </div>
      )}

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default ItemOrderPage;
