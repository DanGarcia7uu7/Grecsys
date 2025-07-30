import React, { useState } from 'react';
import './style.css';

const ListadoClientes = () => {
  const clientesBase = [
    {
      nombre: 'Juan Pérez',
      fechaPago: '2025-07-10',
      mesUltimoPago: 'Julio',
      ip: '192.168.0.10',
      direccion: 'Calle 1, Colonia Centro',
      conexion: 'Fibra',
      precio: '$500',
    },
    {
      nombre: 'Ana López',
      fechaPago: '2025-07-15',
      mesUltimoPago: 'Julio',
      ip: '192.168.0.20',
      direccion: 'Av. Reforma 123',
      conexion: 'Antena',
      precio: '$400',
    },
    {
      nombre: 'Carlos Martínez',
      fechaPago: '2025-06-20',
      mesUltimoPago: 'Junio',
      ip: '192.168.0.30',
      direccion: 'Calle 8, Fracc. Real',
      conexion: 'Fibra',
      precio: '$450',
    },
  ];

  const [busqueda, setBusqueda] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState(clientesBase);

  const manejarBusqueda = () => {
    const resultado = clientesBase.filter(cliente =>
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setClientesFiltrados(resultado);
  };

  return (
    <div className="cliente-container">
      {/* Barra superior de navegación */}
      <nav className="cliente-navbar">
        <img src="./IMG/logoblanco.png" alt="Logo" className="cliente-logo" />
        <ul>
          <li>Nuevo cliente</li>
          <li>Ticket</li>
          <li>Clientes</li>
          <li>Corte</li>
        </ul>
        <div className="cliente-user-icon">👤</div>
      </nav>

      {/* Título */}
      <h2 className="cliente-title">Listado de clientes</h2>

      {/* Buscador */}
      <div className="busqueda-container">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="busqueda-input"
        />
        <button onClick={manejarBusqueda} className="busqueda-boton">
          Buscar
        </button>
      </div>

      {/* Tabla */}
      <table className="cliente-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha de pago</th>
            <th>Mes último pago</th>
            <th>IP</th>
            <th>Dirección</th>
            <th>Conexión</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((cliente, index) => (
            <tr key={index}>
              <td>{cliente.nombre}</td>
              <td>{cliente.fechaPago}</td>
              <td>{cliente.mesUltimoPago}</td>
              <td>{cliente.ip}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.conexion}</td>
              <td>{cliente.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListadoClientes;
