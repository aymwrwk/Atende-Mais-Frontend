import React, { memo } from 'react';

/**
 * Componente reutilizável para grupo de checkboxes
 * @param {Array} options - Array de opções para os checkboxes
 * @param {string} activeValue - Valor atualmente ativo/marcado
 * @param {Function} onChange - Função a ser chamada quando um checkbox é alterado
 */
const CheckboxGroup = memo(({ 
  options, 
  activeValue, 
  onChange,
  orientation = 'vertical',
  className = '',
  classPrefix = ''
}) => {
  return (
    <div className={`checkbox-container${classPrefix ? classPrefix : ''} ${className}`}>
      {options.map(option => (
        <label 
          key={option.value} 
          className={`label-${option.value}${classPrefix ? classPrefix : ''}`}
        >
          <input
            type="checkbox"
            className={`checkbox-${option.value}${classPrefix ? classPrefix : ''}`}
            checked={activeValue === option.value}
            onChange={() => onChange(option.value)}
          />
          <h1 className={`texto-${option.value}${classPrefix ? classPrefix : ''}`}>
            {option.label}
          </h1>
        </label>
      ))}
    </div>
  );
});

// Adicionando displayName para melhorar a identificação em ferramentas de desenvolvimento
CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup; 