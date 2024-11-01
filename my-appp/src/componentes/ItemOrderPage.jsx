import React, { useState } from 'react';

const ItemOrderPage = () => {
  const [items, setItems] = useState([
    { id: '', description: 'Jantinha', quantity: 0, skewer: '' },
    { id: '', description: 'Batata', quantity: 0 },
    { id: '', description: 'Batata Especial', quantity: 0 },
    { id: '', description: 'Porção de Disco', quantity: 0 },
    { id: '', description: 'Taboa de Calabresa', quantity: 0 },
    { id: '', description: 'Taboa de Carne', quantity: 0 },
  ]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [skewerOptionsVisible, setSkewerOptionsVisible] = useState(false);

  const handlePasswordChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].id = value;
    setItems(updatedItems);
  };

  const handleQuantityChange = (index, delta) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = Math.max(0, updatedItems[index].quantity + delta);
    setItems(updatedItems);
  };

  const handleItemClick = (index) => {
    const updatedItems = [...items];
    updatedItems[index].quantity += 1;
    setItems(updatedItems);
  };

  const handleSkewerSelect = (index, skewer) => {
    const updatedItems = [...items];
    updatedItems[index].skewer = skewer;
    updatedItems[index].description = `Jantinha espeto de ${skewer}`;
    setItems(updatedItems);
    setSkewerOptionsVisible(false);
  };

  const handleSkewerClick = () => {
    setSkewerOptionsVisible(!skewerOptionsVisible);
  };

  const sendOrder = async () => {
    const xmlItems = items
      .filter((item) => item.quantity > 0 && item.id.trim() !== '')
      .map((item) => `
        <item>
          <id>${item.id}</id>
          <description>${item.description}</description>
          <quantity>${item.quantity}</quantity>
          <amount>5.00</amount>
        </item>
      `)
      .join('');

    if (xmlItems === '') {
      alert('Por favor, insira uma senha para todos os itens com quantidade maior que zero.');
      return;
    }

    const xml = `<items>${xmlItems}</items>`;
    console.log('XML to be sent:', xml);

    try {
      await fetch('https://atende-mais.shop/pedido/notificacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
        },
        body: xml,
      });
      console.log('Order sent successfully');
    } catch (error) {
      console.error('Error sending order:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {items.map((item, index) => (
        <div
          key={index}
          style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', cursor: 'pointer' }}
          onClick={() => {
            if (index !== 0) handleItemClick(index);
          }}
        >
          <h3>{item.description}</h3>
          <label>
            Senha:
            <input
              type="text"
              value={item.id}
              onChange={(e) => handlePasswordChange(index, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ marginLeft: '10px' }}
            />
          </label>
          {index === 0 && (
            <div>
              <label onClick={(e) => e.stopPropagation()}>
                Espeto:
                <div onClick={handleSkewerClick} style={{ display: 'inline-block', marginLeft: '10px', cursor: 'pointer', color: 'blue' }}>
                  {item.skewer ? item.skewer : 'Escolher espeto'}
                </div>
              </label>
              {skewerOptionsVisible && (
                <div style={{ border: '1px solid #ccc', padding: '5px', marginTop: '5px' }}>
                  {['Frango com Bacon', 'Frango', 'Contra Filé', 'Cupim', 'Kafta de Frango', 'Kafta de Carne', 'Queijo Coalho', 'Provolone'].map((skewer) => (
                    <div
                      key={skewer}
                      style={{ padding: '5px', cursor: 'pointer' }}
                      onClick={() => handleSkewerSelect(index, skewer)}
                    >
                      {skewer}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={{ marginTop: '10px' }}>
            <button onClick={(e) => { e.stopPropagation(); handleQuantityChange(index, -1); }}>-</button>
            <span style={{ margin: '0 10px' }}>{item.quantity}</span>
            <button onClick={(e) => { e.stopPropagation(); handleQuantityChange(index, 1); }}>+</button>
          </div>
        </div>
      ))}
      <button onClick={() => setShowConfirmation(true)} style={{ marginTop: '20px' }}>Enviar Pedido</button>
      {showConfirmation && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
            <h4>Confirmação do Pedido</h4>
            <ul>
              {items
                .filter((item) => item.quantity > 0)
                .map((item, index) => (
                  <li key={index}>{`${item.quantity}x ${item.description}`}</li>
                ))}
            </ul>
            <button onClick={sendOrder}>Sim</button>
            <button onClick={() => setShowConfirmation(false)}>Não</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemOrderPage;
