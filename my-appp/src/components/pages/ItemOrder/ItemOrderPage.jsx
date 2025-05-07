import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItemOrderPage.css';
import Header from "../../../components/common/Header/Header";
import { API_BASE_URL } from '../../../utils/config';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
// Import direto da imagem de fundo
import backgroundImage from '../../../assets/imgs/item-bg.png';

// Estilo inline para garantir que a fonte seja aplicada
const fontStyle = {
  fontFamily: "'Montserrat', sans-serif"
};

// Estilos adicionais para garantir o carregamento da imagem de fundo
const backgroundStyle = {
  ...fontStyle,
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
};

// Constantes
const INITIAL_ITEMS = [
  { description: 'Jantinha', quantity: 0, skewer: '', additionalSkewer: '' },
  { description: 'Jantinha', quantity: 0, skewer: '', additionalSkewer: '' },
  { description: 'Batata', quantity: 0 },
  { description: 'Batata especial', quantity: 0 },
  { description: 'Porção de disco', quantity: 0 },
  { description: 'Tabóa de calabresa', quantity: 0 },
  { description: 'Tabóa de carne', quantity: 0 },
];

const SKEWER_OPTIONS = [
  'FRANGO com BACON',
  'FRANGO',
  'CONTRA FILE',
  'CUPIM',
  'KAFTA DE FRANGO',
  'KAFTA DE CARNE',
  'CORAÇÃO',
  'QUEIJO COALHO',
  'PROVONOLE'
];

const ADDITIONAL_SKEWER_OPTIONS = ['Nenhum', ...SKEWER_OPTIONS];

const API_URL = `${API_BASE_URL}/pedido/notificacoes`;

// Componente de botão de quantidade
const QuantityButton = memo(({ quantity, onDecrease, onIncrease }) => (
  <div className='div-botoes-mais-menos' style={fontStyle}>
    <button 
      className="quantity-btn decrease"
      onClick={onDecrease}
      style={fontStyle}
    >
      -
    </button>
    <span className="quantity-display" style={fontStyle}>{quantity}</span>
    <button 
      className="quantity-btn increase"
      onClick={onIncrease}
      style={fontStyle}
    >
      +
    </button>
  </div>
));

// Componente de dropdown de seleção (substituído pelo Headless UI)
const SkewerMenu = memo(({ options, onSelect, buttonText }) => (
  <Menu as="div" className="relative inline-block text-left overflow-visible z-50" style={fontStyle}>
    <div onClick={(e) => e.stopPropagation()} style={fontStyle}>
      <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" style={fontStyle}>
        {buttonText}
        <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
      </Menu.Button>
    </div>

    <Menu.Items
      anchor="bottom end"
      className="z-50 mt-2 w-56 origin-top-right overflow-visible rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
      style={{fontStyle, zIndex: 9999}}
    >
      <div className="py-1" style={fontStyle}>
        {options.map((option) => (
          <Menu.Item key={option}>
            {({ active }) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(option);
                }}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                }`}
                style={fontStyle}
              >
                {option}
              </button>
            )}
          </Menu.Item>
        ))}
      </div>
    </Menu.Items>
  </Menu>
));

// Componente de confirmação de pedido
const OrderConfirmation = memo(({ items, password, onConfirm, onCancel }) => {
  const itemsWithQuantity = items.filter(item => item.quantity > 0);
  const manyItems = itemsWithQuantity.length > 4; // Verificar se há muitos itens
  
  return (
    <div className="confirmacao-pedido" style={fontStyle}>
      <div className={`teste-confi !bg-gray-50 ${manyItems ? 'many-items' : ''}`} style={fontStyle}>
        <h4 className="h4-confirmacao-do-pedido" style={fontStyle}>Confirmação do Pedido</h4>
        
        <ul className='ul-item-menu' style={fontStyle}>
          {itemsWithQuantity.map((item, index) => (
            <li className='li-confirmacao-item' key={index} style={fontStyle}>
              {`${item.quantity}x ${item.description}`}
            </li>
          ))}
        </ul>
        
        <div className='div-senha-item' style={fontStyle}>
          <strong className="h4-senha-do-pedido" style={fontStyle}>Senha do Pedido:</strong>
          <span className='senha-item' style={fontStyle}>{password}</span>
        </div>
        
        <div
            className="div-botoes-item
              bg-gray-50 px-4 py-3
              flex flex-col                /* empilha vertical */
              gap-2                        /* espaço entre os botões */
              sm:flex-col                 /* mantém empilhado em sm+ */
              sm:px-6"
            style={fontStyle}
        >
          <button
            type="button"
              onClick={onConfirm}
              style={fontStyle}
              className="
                w-full sm:w-auto
                inline-flex justify-center rounded-md
                bg-red-600 px-3 py-2 text-sm font-semibold text-white
                shadow-sm hover:bg-red-500
              "
              >
            Sim
          </button>
          <button
            type="button"
            data-autofocus
            onClick={onCancel}
            style={fontStyle}
            className="
              w-full sm:w-auto
              inline-flex justify-center rounded-md
              bg-white px-3 py-2 text-sm font-semibold text-gray-900
              shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50
            "
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
});

// Componente de item de menu
const MenuItem = ({ 
  item, 
  index, 
  onItemClick,
  onSkewerSelect,
  onAdditionalSkewerSelect,
  onQuantityChange
}) => {
  const isJantinha = index === 0 || index === 1;
  
  const handleDecrease = (e) => {
    e.stopPropagation();
    onQuantityChange(index, -1);
  };
  
  const handleIncrease = (e) => {
    e.stopPropagation();
    onQuantityChange(index, 1);
  };

  return (
    <div
      className="div-conteiner-itemorder"
      onClick={() => onItemClick(index)}
      style={fontStyle}
    >
      <div className="descricao-item-div" style={fontStyle}>
        <p className="descricao-item" style={fontStyle}>{item.description}</p>
      </div>
      
      {isJantinha && (
        <div className="testeitem" style={fontStyle}>
          <label className='espeto-div-item' onClick={(e) => e.stopPropagation()} style={fontStyle}>
            <SkewerMenu 
              options={SKEWER_OPTIONS} 
              onSelect={(skewer) => onSkewerSelect(index, skewer)}
              buttonText={item.skewer || 'Escolher espeto'}
            />
          </label>
          
          <label className='espeto-adicional-div' onClick={(e) => e.stopPropagation()} style={fontStyle}>
            <SkewerMenu 
              options={ADDITIONAL_SKEWER_OPTIONS} 
              onSelect={(option) => onAdditionalSkewerSelect(index, option)}
              buttonText={item.additionalSkewer || 'Espeto adicional'}
            />
          </label>
        </div>
      )}
      
      <QuantityButton
        quantity={item.quantity}
        onDecrease={handleDecrease}
        onIncrease={handleIncrease}
      />
    </div>
  );
};

// Funções auxiliares
const createOrderXml = (items, password) => {
  const itemsWithQuantity = items.filter(item => item.quantity > 0);
  
  const xmlItems = itemsWithQuantity
    .map(item => `
      <item>
        <id>${password}</id>
        <description>${item.description}</description>
        <quantity>${item.quantity}</quantity>
        <amount>5.00</amount>
      </item>
    `.trim())
    .join('');
    
  return `
  <pedidos>
    <items>
      ${xmlItems}
    </items>
  </pedidos>`.trim();
};

const updateJantinhaDescription = (item) => {
  const { skewer, additionalSkewer } = item;
  if (!skewer) return "Jantinha";
  
  const mainSkewer = `espeto de ${skewer}`;
  const additional = additionalSkewer
    ? ` + espeto adicional ${additionalSkewer}`
    : '';
  
  return `Jantinha ${mainSkewer}${additional}`;
};

// Componente principal
const ItemOrderPage = () => {
  const [items, setItems] = useState(() => INITIAL_ITEMS.map(item => ({ ...item })));
  const [password, setPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fadeOutSuccess, setFadeOutSuccess] = useState(false);
  const [fadeOutError, setFadeOutError] = useState(false);
  const navigate = useNavigate();

  // Handler para mostrar mensagem de sucesso
  const showSuccessMessage = useCallback((message) => {
    setSuccessMessage(message);
    setFadeOutSuccess(false);
    
    // Inicia animação de saída após 2.5 segundos
    setTimeout(() => {
      setFadeOutSuccess(true);
      // Remove a mensagem após a animação terminar
      setTimeout(() => setSuccessMessage(''), 500);
    }, 2500);
  }, []);

  // Handler para mostrar mensagem de erro
  const showErrorMessage = useCallback((message) => {
    setErrorMessage(message);
    setFadeOutError(false);
    
    // Inicia animação de saída após 2.5 segundos
    setTimeout(() => {
      setFadeOutError(true);
      // Remove a mensagem após a animação terminar
      setTimeout(() => setErrorMessage(''), 500);
    }, 2500);
  }, []);

  // Handlers
  const handlePasswordChange = useCallback((value) => {
    setPassword(value);
  }, []);

  const handleQuantityChange = useCallback((index, delta) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: Math.max(0, updatedItems[index].quantity + delta)
      };
      return updatedItems;
    });
  }, []);

  const handleItemClick = useCallback((index) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      // Para os itens que não dependem do espeto, incrementa normalmente
      if (index !== 0 && index !== 1) {
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: updatedItems[index].quantity + 1
        };
      }
      return updatedItems;
    });
  }, []);

  const handleSkewerSelect = useCallback((index, skewer) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      // Se for o item de espeto e a quantidade for 0, ajusta para 1
      const newQuantity = 
        (index === 0 || index === 1) && updatedItems[index].quantity === 0
          ? 1
          : updatedItems[index].quantity;
      
      const updatedItem = {
        ...updatedItems[index],
        quantity: newQuantity,
        skewer: skewer
      };
      
      updatedItem.description = updateJantinhaDescription(updatedItem);
      updatedItems[index] = updatedItem;
      
      return updatedItems;
    });
  }, []);

  const handleAdditionalSkewerSelect = useCallback((index, additionalSkewer) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      
      const updatedItem = {
        ...updatedItems[index],
        additionalSkewer: additionalSkewer === 'Nenhum' ? '' : additionalSkewer
      };
      
      updatedItem.description = updateJantinhaDescription(updatedItem);
      updatedItems[index] = updatedItem;
      
      return updatedItems;
    });
  }, []);

  const resetOrder = useCallback(() => {
    setItems(INITIAL_ITEMS.map(item => ({ ...item })));
    setPassword('');
    setShowConfirmation(false);
  }, []);

  const validateOrder = useCallback(() => {
    if (!password.trim()) {
      showErrorMessage('Por favor, insira uma senha.');
      return false;
    }
    
    const itemsWithQuantity = items.filter(item => item.quantity > 0);
    if (itemsWithQuantity.length === 0) {
      showErrorMessage('Por favor, adicione ao menos um item ao pedido.');
      return false;
    }
    
    return true;
  }, [items, password, showErrorMessage]);

  const sendOrder = useCallback(async () => {
    if (!validateOrder()) return;
    
    const xml = createOrderXml(items, password);
    console.log('XML to be sent:', xml);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/xml'
        },
        body: xml,
      });
      
      if (response.status === 201) {
        showSuccessMessage('Pedido adicionado com sucesso');
        resetOrder();
      } else {
        showErrorMessage('Erro ao enviar pedido. Tente novamente.');
        console.error('Erro ao enviar pedido, status:', response.status);
      }
    } catch (error) {
      showErrorMessage('Erro de conexão. Verifique sua internet.');
      console.error('Error sending order:', error);
    }
  }, [validateOrder, password, items, navigate, resetOrder, showSuccessMessage, showErrorMessage]);

  // Memorize os itens com quantidade para otimizar renderização
  const itemsWithQuantity = useMemo(() => 
    items.filter(item => item.quantity > 0), 
  [items]);

  return (
    <div className='body-item' style={backgroundStyle}>
      <header className="header-menu">
        <Header />
        <div className="random-div">
          <p className="p-header-center">
            Item
          </p>
        </div>
      </header>
      <br />
      
      {items.map((item, index) => (
        <MenuItem
          key={`item-${index}`}
          item={item}
          index={index}
          onItemClick={handleItemClick}
          onSkewerSelect={handleSkewerSelect}
          onAdditionalSkewerSelect={handleAdditionalSkewerSelect}
          onQuantityChange={handleQuantityChange}
        />
      ))}
      
      <div className="top-bar">
        <input
          type="number"
          placeholder="Senha"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          className="password-input"
          style={fontStyle}
        />
        <button
          onClick={() => setShowConfirmation(true)}
          className="send-button"
          style={fontStyle}
        >
          Enviar
        </button>
      </div>
      
      {showConfirmation && (
        <OrderConfirmation
          items={items}
          password={password}
          onConfirm={sendOrder}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
      
      {successMessage && (
        <div className={`success-message ${fadeOutSuccess ? 'fadeOut' : ''}`} style={fontStyle}>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className={`error-message ${fadeOutError ? 'fadeOut' : ''}`} style={fontStyle}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default ItemOrderPage;