import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Entregues from './componentes/Entregues'
import Registro from './componentes/login/Registro';
import Home from './componentes/Home';
import HomeCliente from './componentes/HomeCliente';
import Prefixos from './componentes/Prefixos';
import Login from './componentes/login/Loginpage';
import ItemOrderPage from "./componentes/ItemOrderPage";
import Relatorios from "./componentes/Relatorios";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/inicio" element={<Home />} />
				<Route path="/inicio-cliente/:idEstabelecimento?" element={<HomeCliente />} />
				<Route path="/entregues" element={<Entregues />} />
				<Route path="/prefixo" element={<Prefixos />} />
				<Route path="/login" element={<Login />} />
				<Route path="/registro" element={<Registro />} />
				<Route path="/item" element={<ItemOrderPage />} />
				<Route path="/relatorios" element={<Relatorios />} />
			</Routes>
		</Router>
	);
};

export default App;