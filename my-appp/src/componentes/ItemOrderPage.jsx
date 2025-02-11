import React, { useState } from 'react';
import './ItemOrderPage.css';

const ItemOrderPage = () => {
  const [items, setItems] = useState([
    { description: 'Jantinha', quantity: 0, skewer: '' },
    { description: 'Jantinha', quantity: 0, skewer: '' },
    { description: 'Batata', quantity: 0 },
    { description: 'Batata especial', quantity: 0 },
    { description: 'Porção de disco', quantity: 0 },
    { description: 'Taboa de calabresa', quantity: 0 },
    { description: 'Taboa de carne', quantity: 0 },
  ]);
  const [password, setPassword] = useState(''); // Campo único de senha
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [skewerOptionsVisible, setSkewerOptionsVisible] = useState({});
  const [additionalSkewerOptionsVisible, setAdditionalSkewerOptionsVisible] = useState({});
  
  
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

    if (index !== 0 && index !== 1) {
      // Incrementa normalmente para os outros índices
      updatedItems[index].quantity += 1;
    }

    setItems(updatedItems);
  };

  const handleSkewerSelect = (index, skewer) => {
    const updatedItems = [...items];

    // Se for índice 0 ou 1 e a quantidade for 0, incrementa para 1
    if ((index === 0 || index === 1) && updatedItems[index].quantity === 0) {
      updatedItems[index].quantity = 1;
    }

    updatedItems[index].skewer = skewer;

    // Atualiza a descrição do item com o espeto selecionado
    const additional = updatedItems[index].additionalSkewer ? ` + espeto adicional de ${updatedItems[index].additionalSkewer}` : '';
    updatedItems[index].description = `Jantinha espeto de ${skewer}${additional}`;

    setItems(updatedItems);

    // Fecha o menu de seleção de espetos
    setSkewerOptionsVisible((prev) => ({ ...prev, [index]: false }));
  };

  const handleAdditionalSkewerSelect = (index, additionalSkewer) => {
    const updatedItems = [...items];

    // Se a opção "Nenhum" for selecionada, removemos o espeto adicional
    if (additionalSkewer === 'Nenhum') {
      updatedItems[index].additionalSkewer = ''; // Limpa o espeto adicional
    } else {
      updatedItems[index].additionalSkewer = additionalSkewer;
    }

    // Atualiza a descrição com o espeto adicional, ou sem se não houver
    const mainSkewer = updatedItems[index].skewer ? `espeto de ${updatedItems[index].skewer}` : '';
    const additional = updatedItems[index].additionalSkewer ? ` + espeto adicional de ${updatedItems[index].additionalSkewer}` : '';
    updatedItems[index].description = `Jantinha ${mainSkewer}${additional}`;

    setItems(updatedItems);
    setAdditionalSkewerOptionsVisible(false);
  };

  const handleAdditionalSkewerClick = (index) => {
    setAdditionalSkewerOptionsVisible((prev) => ({
      ...prev,
      [index]: !prev[index], // Alterna visibilidade para o índice clicado
    }));
  };

  const handleSkewerClick = (index) => {
    setSkewerOptionsVisible((prev) => ({
      ...prev,
      [index]: !prev[index], // Alterna visibilidade para o índice clicado
    }));
  };

  const resetOrder = () => {
    const resetItems = items.map((item) => ({ ...item, quantity: 0 })); // Zera as quantidades
    setItems(resetItems);
    setPassword(''); // Limpa a senha
    setShowConfirmation(false); // Fecha o pop-up
  };

  const sendOrder = async () => {
    if (!password.trim()) {
      alert('Por favor, insira uma senha.');
      return;
    }

    // Verifica se pelo menos um item foi selecionado
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
      await fetch('https://atende-mais.shop/pedido/notificacoes', {
     // await fetch('http://192.168.1.6:8080/pedido/notificacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
        },
        body: xml,
      });
      console.log('Order sent successfully');
      resetOrder(); // **Chama o reset após o sucesso**
    } catch (error) {
      console.error('Error sending order:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {items.map((item, index) => (
        <div
          className="div-conteiner-itemorder"
          key={index}
          style={{ border: '1px solid #ccc', padding: '25px', marginBottom: '10px', cursor: 'pointer', borderRadius: '7px', backgroundColor: '#0000' }}
          onClick={() => {
            // if (index !== 0) handleQuantityChange(index, 1);
            handleItemClick(index);
          }}
        >
          <div className="descricao-item-div">
            <p className="descricao-item">{item.description}</p>
          </div>
          {(index === 0 || index === 1) && ( 
            <div className='testeitem' style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '30px', textAlign: 'center' }}>
              <label onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer' }}>
                Espeto:
                <div
                  onClick={() => handleSkewerClick(index)}
                  style={{ display: 'inline-block', marginLeft: '10px', cursor: 'pointer', color: 'blue' }}
                >
                  {item.skewer || 'Escolher espeto'}
                </div>
              </label>
              {skewerOptionsVisible[index] && (
                <div style={{ border: '1px solid #ccc', padding: '5px', marginTop: '10px', position: 'absolute',
                  backgroundColor: 'white', // Fundo branco para o menu
                  zIndex: 10, marginBottom: '5px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}>
                  {['FRANGO COM BACON', 'FRANGO', 'CONTRA FILE ', 'CUPIM', 'KAFTA DE FRANGO', 'KAFTA DE CARNE', 'QUEIJO COALHO', 'PROVONOLE'].map(
                    (skewer) => (
                      <div
                        key={skewer}
                        style={{ padding: '10px', cursor: 'pointer', borderBottom: '1.4px black solid', borderRadius: '4px' }}
                        onClick={() => handleSkewerSelect(index, skewer)}
                      >
                        {skewer}
                      </div>
                    )
                  )}
                </div>
              )}

              <label onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer' }}>
                Espeto Adicional:
                <div
                  onClick={() => handleAdditionalSkewerClick(index)}
                  style={{ display: 'inline-block', marginLeft: '10px', cursor: 'pointer', color: 'blue' }}
                >
                  {item.additionalSkewer || 'Escolher espeto adicional'}
                </div>
              </label>
              {additionalSkewerOptionsVisible[index] && (
                <div style={{ border: '1px solid #ccc', padding: '5px', marginTop: '160px', marginLeft: '180px', position: 'absolute', // Mantém o menu posicionado abaixo
        backgroundColor: 'white', // Fundo branco para o menu
        zIndex: 10, marginBottom: '5px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',}}>

                  {['Nenhum', 'FRANGO COM BACON', 'FRANGO', 'CONTRA FILE ', 'CUPIM', 'KAFTA DE FRANGO', 'KAFTA DE CARNE', 'QUEIJO COALHO', 'PROVONOLE'].map(
                    (additionalSkewer) => (
                      <div
                        key={additionalSkewer}
                        style={{ padding: '10px', cursor: 'pointer', borderBottom: '1.4px black solid', borderRadius: '4px' }}
                        onClick={() => handleAdditionalSkewerSelect(index, additionalSkewer)}
                      >
                        {additionalSkewer}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}
          <div style={{ marginTop: '10px', marginBottom: '-20px'}}>
            <button style={{ margin: '5 11px', fontSize: '30px' , paddingLeft: '4px', paddingRight: '4px' }}
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(index, -1);
              }}
            >
              -
            </button>
            
            <span style={{ margin: '5 11px', fontSize: '25px', color: 'tomato' }}>{item.quantity}</span>

            <button style={{ margin: '5 11px', fontSize: '30px' }}
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
            //type="text"
             type="number" placeholder='Senha'
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            style={{ marginLeft: '24%', padding: '7px' }}
          />
      
        <button onClick={() => setShowConfirmation(true)} style={{ marginLeft: '140px', padding:'10px', backgroundColor: '#ffcf4bc9', border: 'none', borderRadius:'5px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'}}>Enviar Pedido</button>
      </div>

      {showConfirmation && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ backgroundColor: 'white', padding: '60px', borderRadius: '5px' }}>
            <h4 className='h4-confirmacao-do-pedido'>Confirmação do Pedido</h4>
            <ul>
              {items
                .filter((item) => item.quantity > 0)
                .map((item, index) => (
                  <li style={{ padding: '20px', fontSize: '20px', fontWeight:'bolder' }}key={index}>{`${item.quantity}x ${item.description}`}</li>
                ))}
            </ul>
            {/* Adiciona a senha fora do loop de itens */}
            <div><strong className='h4-senha-do-pedido'>Senha do Pedido:</strong>

             <span style={{marginLeft:'10px', fontSize: '28px', fontWeight: 'bolder', color: 'tomato' }}>{password}</span>
            
             </div>
            <br />
            <br />
            <button style={{marginLeft:'55px', margintTop: '10px', padding:'10px', backgroundColor: '#0c8d39', border: 'none', borderRadius:'7px' , color: 'white'}}
              onClick={async () => {
                await sendOrder(); // Envia o pedido
                resetOrder(); // Reseta os itens e a senha
              }}
            >
              Sim
            </button>
            <button style={{ marginLeft:'50px', margintTop: '10px', padding:'10px', backgroundColor: '#b40f35', border: 'none', borderRadius:'7px', color: 'white'}} onClick={() => setShowConfirmation(false)}>Não</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemOrderPage;
