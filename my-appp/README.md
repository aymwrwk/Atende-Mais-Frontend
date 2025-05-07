# Atende-Mais Frontend

Aplicação frontend para o sistema Atende-Mais.

## Estrutura do Projeto

A estrutura do projeto segue boas práticas de organização de código React:

```
src/
├── assets/             # Recursos estáticos (imagens, fontes, etc.)
│   └── images/         # Imagens do projeto
│
├── components/         # Componentes React
│   ├── common/         # Componentes compartilhados
│   └── pages/          # Componentes de páginas completas
│
├── context/            # Contextos React para gerenciamento de estado
│
├── hooks/              # Hooks personalizados
│
├── services/           # Serviços para comunicação com APIs
│
├── styles/             # Arquivos de estilo globais
│
└── utils/              # Utilitários e funções auxiliares
```

## Guia de Migração

Para migrar do formato antigo para a nova estrutura, siga estas instruções:

1. **Componentes de página**: Mover os arquivos de componentes de página para `src/components/pages/`
   - Exemplo: `src/componentes/Home.jsx` -> `src/components/pages/Home/index.jsx`
   - CSS relacionado: `src/componentes/Home.css` -> `src/components/pages/Home/styles.css`

2. **Componentes comuns**: Mover os componentes compartilhados para `src/components/common/`
   - Exemplo: `src/componentes/Header.jsx` -> `src/components/common/Header/index.jsx`

3. **Arquivos de autenticação**: Mover os componentes de login para `src/components/pages/Auth/`
   - Exemplo: `src/componentes/login/Loginpage.jsx` -> `src/components/pages/Auth/Login/index.jsx`

4. **Recursos estáticos**: Mover recursos para a pasta apropriada em `src/assets/`
   - Exemplo: `src/componentes/ATENDEMAIS.png` -> `src/assets/images/ATENDEMAIS.png`

5. **Estilos globais**: Mover estilos globais para `src/styles/`
   - Exemplo: `src/componentes/Index.css` -> `src/styles/global.css`

6. **Atualizar Importações**: Ajustar todas as importações para refletir a nova estrutura

## Serviços Disponíveis

Os serviços foram abstraídos para facilitar a manutenção:

- **authService**: Gerenciamento de autenticação
- **reportService**: Manipulação de relatórios

## Utilitários

- **config.js**: Configurações centralizadas
- **errorHandler.js**: Tratamento padronizado de erros
- **dateUtils.js**: Funções para manipulação de datas

## Scripts Disponíveis

- `yarn start`: Inicia o servidor de desenvolvimento
- `yarn build`: Compila o projeto para produção

## Solução de Problemas (Troubleshooting)

### Problemas de Autenticação (Erro 403)

Se você encontrar problemas com autenticação (erro 403 Forbidden), existem algumas ferramentas de diagnóstico disponíveis no sistema:

1. **Página de Diagnóstico de Login**: Acessível através do link "Diagnóstico de Login" na página de login. Esta ferramenta permite testar diferentes configurações de login para identificar onde está o problema.

2. **Teste de API**: Acessível através da página de diagnóstico de login. Verifica problemas de conectividade com a API e issues relacionados a CORS.

#### Causas comuns de erros 403:

- **CORS**: Problemas de Cross-Origin Resource Sharing (CORS) podem impedir requisições do frontend para a API.
- **Autenticação**: Tokens expirados ou configurações incorretas de cabeçalhos de autenticação.
- **Conectividade**: Problemas de rede na comunicação com o servidor.

#### Soluções:

1. Limpar o localStorage para remover tokens antigos:
```javascript
localStorage.removeItem('token');
```

2. Verificar se os headers de autenticação estão sendo enviados corretamente:
```javascript
// Exemplo de requisição autenticada
axios.get('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

3. Se os problemas persistirem, use as ferramentas de diagnóstico para identificar a causa raiz.
