import React, { memo } from 'react';
import './PedidoCard.css';

/**
 * Componente reutilizável para exibir cards de pedidos
 * @param {Object} pedido - Objeto com dados do pedido
 * @param {Function} onStatusChange - Função para alterar status do pedido
 * @param {React.ReactNode} leftContent - Conteúdo a ser exibido à esquerda (checkboxes)
 * @param {boolean} showHorario - Define se exibe horário (Entregues) ou checkbox de status (Home)
 */
const PedidoCard = memo(({ 
  pedido, 
  onStatusChange,
  leftContent,
  showHorario = false,
  className = ''
}) => {
  // Estilo inline para garantir posicionamento consistente da quantidade em Entregues
  const quantidadeStyle = showHorario ? {
    position: 'absolute',
    top: '10px',
    left: '50px',
    textAlign: 'left'
  } : {};

  // Formata a hora para exibição, extraindo apenas horas e minutos
  const formatarHora = (horaCompleta) => {
    if (!horaCompleta) return '';
    return horaCompleta.split(':').slice(0, 2).join(':');
  };

  return (
    <div className={className}>
      {/* Área esquerda (checkboxes ou outro conteúdo) */}
      <div className="div-checkbox">
        {leftContent}
      </div>

      {/* Área principal com detalhes do pedido */}
      <div className="conteudo-detalhes">
        {/* Indicador de status */}
        <div className={showHorario ? "status-container2" : "status-container"}>
          <div className={`indicador-status ${pedido.status}`}></div>
        </div>

        {/* Quantidade */}
        <div 
          className={showHorario ? "quantidade-all2" : "quantidade-all"}
          style={quantidadeStyle}
        >
          <h2 className="quantidadeTexto">Quantidade</h2>
          <h2 className="quantidade">{pedido.quantity}</h2>
        </div>

        {/* Senha/ID */}
        <div className={showHorario ? "senha-all4" : "senha-all3"}>
          <h2 className="senhaTexto3">Senha</h2>
          <h1 className="senha3">{pedido.reference_id}</h1>
        </div>

        {/* Área que muda entre Horário (Entregues) ou Checkbox (Home) */}
        {showHorario ? (
          <div className="horario">
            <h1 className="hora">{formatarHora(pedido.hora)}</h1>
            <h1 className="horario-texto">Horário</h1>
          </div>
        ) : (
          <div className="checkbox-detalhes">
            <p className="texto-checkbox">Pronto</p>
            <label>
              <input
                type="checkbox"
                className="checkbox-detalhe"
                checked={pedido.status === 'pronto'}
                onChange={() => onStatusChange(pedido, pedido.status === 'pronto' ? 'andamento' : 'pronto')}
              />
            </label>
          </div>
        )}

        {/* Descrição do pedido */}
        <div className="div-descricao">
          <p className="descricao">{pedido.description}</p>
        </div>
      </div>
    </div>
  );
});

// Adicionando displayName para melhorar a identificação em ferramentas de desenvolvimento
PedidoCard.displayName = 'PedidoCard';

export default PedidoCard; 