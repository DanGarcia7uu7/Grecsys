import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../styles/style.css';

const ListadoClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // Traer clientes desde backend
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/clientes'); 
        if (res.ok) {
          const data = await res.json();
          setClientes(data);
        } else {
          console.error('Error al traer clientes');
        }
      } catch (err) {
        console.error('Error en la petición:', err);
      }
    };
    fetchClientes();
  }, []);

  // Filtrar clientes en tiempo real
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="cliente-container">
      <nav className="cliente-navbar">
        <img src="./IMG/logoblanco.png" alt="Logo" className="cliente-logo" />
        <ul>
          <li className='activo'><Link to="/Dashboard">Dashboard</Link></li>
          <li><Link to="/nuevo-cliente">Nuevo cliente</Link></li>
          <li><Link to="/ticket">Pagos</Link></li>
          <li><Link to="/ListadoClientes">Clientes</Link></li>
          <li><Link to="/CorteDelDia">Cortes</Link></li>
        </ul>
        <div className="cliente-user-icon"><Link to="/PerfilUsuario">Perfil</Link>👤</div>
      </nav>

      <h2 className="cliente-title">Listado de clientes</h2>

      <div className="busqueda-container">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="busqueda-input"
        />
      </div>

      <table className="cliente-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha de pago</th>
            <th>Fecha último pago</th>
            <th>IP</th>
            <th>Dirección</th>
            <th>Conexión</th>
            <th>Costo paquete</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((cliente, index) => (
            <tr key={index}>
              <td>{cliente.nombre}</td>
              <td>{cliente.fecha_pago}</td>
              <td>{cliente.fecha_ultimo_pago}</td>
              <td>{cliente.ip}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.conexion}</td>
              <td>{cliente.costo_paquete}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListadoClientes;
