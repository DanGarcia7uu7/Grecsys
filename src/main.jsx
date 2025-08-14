import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ForgotPassword from './grecsys-frontend/ForgotPassword.jsx';
import NuevoCliente from './grecsys-frontend/NuevoCliente.jsx';
import PerfilUsuario from './grecsys-frontend/PerfilUsuario.jsx';
import ListadoClientes from './grecsys-frontend/ListadoClientes.jsx';
import Ticket from './grecsys-frontend/Ticket.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CorteDelDia from './grecsys-frontend/Cortedia.jsx';
import Dashboard from './grecsys-frontend/Dashboard.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/olvide" element={<ForgotPassword />} />
      <Route path="/nuevo-cliente" element={<NuevoCliente />} />
      <Route path="/PerfilUsuario" element={<PerfilUsuario />} /> 
      <Route path="/ListadoClientes" element={<ListadoClientes />} /> 
      <Route path="/ticket" element={<Ticket />} />
      <Route path="/CorteDelDia" element={<CorteDelDia />} />
      <Route path="/Dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);
