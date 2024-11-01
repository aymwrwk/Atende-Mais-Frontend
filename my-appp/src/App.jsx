import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Entregues from './componentes/Entregues'
import Home from './componentes/Home';
import Prefixos from './componentes/prefixos/Prefixos';
import Login from './componentes/login/Loginpage';
import Credenciais from './componentes/credenciais/Credenciais';
import Ocr from './componentes/CameraPage';
import ItemOrderPage from "./componentes/ItemOrderPage";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/home" element={<Home />} />
				<Route path="/home1" element={<h1>Home Page</h1>} />
				<Route path="/entregues" element={<Entregues />} />
				<Route path="/prefixo" element={<Prefixos />} />
				<Route path="/credenciais" element={<Credenciais />} />
				<Route path="/login" element={<Login />} />
				<Route path="/ocr" element={<Ocr />} />
				<Route path="/item" element={<ItemOrderPage />} />
			</Routes>
		</Router>
	);
};

export default App;