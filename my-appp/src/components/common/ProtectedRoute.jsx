import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services';

/**
 * Componente que verifica se o usuário está autenticado
 * Redireciona para a página de login caso não esteja
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    // Configura os interceptors do Axios ao carregar o componente
    if (isAuthenticated) {
      authService.setupAxiosInterceptors();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    // Redireciona para login, mas salva a rota atual para redirecionamento após login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 