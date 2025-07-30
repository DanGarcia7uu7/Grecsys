import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import NuevoCliente from './NuevoCliente.jsx';
import PerfilUsuario from './PerfilUsuario.jsx';
import ListadoClientes from './ListadoClientes.jsx';
import Ticket from './Ticket';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/olvide" element={<ForgotPassword />} />
      <Route path="/nuevo-cliente" element={<NuevoCliente />} />
      <Route path="/PerfilUsuario" element={<PerfilUsuario />} /> 
      <Route path="/ListadoClientes" element={<ListadoClientes />} /> 
      <Route path="/ticket" element={<Ticket />} />
    </Routes>
  </BrowserRouter>
);
