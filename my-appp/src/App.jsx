import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importação do componente de rota protegida
import ProtectedRoute from "./components/common/ProtectedRoute";

// Importações dos componentes de páginas na nova estrutura
import Home from './components/pages/Home/Home';
import HomeCliente from './components/pages/HomeCliente/HomeCliente';
import Entregues from './components/pages/Entregues/Entregues';
import Prefixos from './components/pages/Prefixos/Prefixos';
import ItemOrderPage from "./components/pages/ItemOrder/ItemOrderPage";
import Relatorios from "./components/pages/Relatorios/Relatorios";
import Teste from "./components/pages/Teste/Teste"
import Maim from "./components/pages/Expose/Maim";

// Importações dos componentes de autenticação
import Login from './components/pages/Auth/Login/Loginpage';
import Registro from './components/pages/Auth/Registro/Registro';
import LoginTroubleshoot from './components/pages/Auth/Login/LoginTroubleshoot';
import ApiTest from './components/pages/testApi/ApiTest';

/**
 * Componente principal da aplicação que define as rotas
 */
const App = () => {
	return (
		<Router>
			<Routes>
				{/* Rotas protegidas - necessitam autenticação */}
				<Route path="/inicio" element={
					<ProtectedRoute>
						<Home />
					</ProtectedRoute>
				} />
				<Route path="/inicio-cliente/:idEstabelecimento?" element={
					<ProtectedRoute>
						<HomeCliente />
					</ProtectedRoute>
				} />
				<Route path="/entregues" element={
					<ProtectedRoute>
						<Entregues />
					</ProtectedRoute>
				} />
				<Route path="/prefixo" element={
					<ProtectedRoute>
						<Prefixos />
					</ProtectedRoute>
				} />
				<Route path="/item" element={
					<ProtectedRoute>
						<ItemOrderPage />
					</ProtectedRoute>
				} />
				<Route path="/relatorios" element={
					<ProtectedRoute>
						<Relatorios />
					</ProtectedRoute>
				} />
				
				{/* Rotas públicas - não necessitam autenticação */}
				<Route path="/login" element={<Login />} />
				<Route path="/registro" element={<Registro />} />
				<Route path="/login-debug" element={<LoginTroubleshoot />} />
				<Route path="/api-test" element={<ApiTest />} />
				<Route path="/t" element={<Teste />} />
				<Route path="/expo" element={<Maim/>} />

				{/* Rota padrão - redireciona para login */}
				<Route path="*" element={<Login />} />
			</Routes>
		</Router>
	);
};

export default App;