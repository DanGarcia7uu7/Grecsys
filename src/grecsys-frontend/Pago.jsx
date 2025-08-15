import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../styles/style.css';
import jsPDF from 'jspdf';

const Pago = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mesesPagados, setMesesPagados] = useState(1);
  const [precioPaquete, setPrecioPaquete] = useState(0);
  const [descripcionTicket, setDescripcionTicket] = useState('');

  // Cargar clientes desde backend
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/clientes');
        if (res.ok) {
          const data = await res.json();
          setClientes(data);
        }
      } catch (err) {
        console.error('Error en la petición:', err);
      }
    };
    fetchClientes();
  }, []);

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSeleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setPrecioPaquete(cliente.costo_paquete);
    setDescripcionTicket('');
  };

  // Función para generar PDF
  const generarPDF = (ticketData) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Ticket`, 105, 15, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`Cliente: ${ticketData.cliente_nombre}`, 10, 30);
    doc.text(`Pago ID: ${ticketData.pago_id}`, 10, 40);
    doc.text(`Meses pagados: ${ticketData.meses_pagados}`, 10, 50);
    doc.text(`Precio: ${ticketData.precio_paquete}`, 10, 60);
    doc.text(`Descripción: ${ticketData.descripcion}`, 10, 70);
    doc.text(`Estado: ${ticketData.estado}`, 10, 80);
    doc.text(`Fecha creación: ${ticketData.fecha_creacion}`, 10, 90);
    doc.save(`ticket_${ticketData.cliente_nombre}_${ticketData.fecha_creacion}.pdf`);
  };

  // Generar pago y ticket en un solo POST
  const handleGenerarPago = async () => {
    if (!clienteSeleccionado) {
      alert("Selecciona un cliente");
      return;
    }
    if (!mesesPagados || !precioPaquete) {
      alert("Completa los datos del pago");
      return;
    }
    if (!descripcionTicket.trim()) {
      alert("Ingresa la descripción del ticket");
      return;
    }

    const nuevoPagoYTicket = {
      cliente_id: clienteSeleccionado.id_clientes,
      fecha_pago: new Date().toISOString().split('T')[0],
      meses_pagados: mesesPagados,
      precio_paquete: precioPaquete,
      descripcion: descripcionTicket,
      estado: "Abierto"
    };

    try {
      const res = await fetch('http://localhost:3001/api/pagos-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPagoYTicket)
      });

      const data = await res.json();

      if (res.ok) {
        // Descargar PDF automáticamente
        generarPDF({
          cliente_nombre: clienteSeleccionado.nombre,
          pago_id: data.pagoId,
          meses_pagados: mesesPagados,
          precio_paquete: precioPaquete,
          descripcion: descripcionTicket,
          estado: "Abierto",
          fecha_creacion: new Date().toISOString().split('T')[0]
        });

        alert(`Pago y ticket registrados para ${clienteSeleccionado.nombre}`);
        setClienteSeleccionado(null);
        setMesesPagados(1);
        setPrecioPaquete(0);
        setDescripcionTicket('');
      } else {
        alert(data.mensaje || 'Error al registrar pago y ticket');
      }
    } catch (err) {
      console.error('Error en la petición:', err);
      alert('Error en la petición al servidor');
    }
  };

  return (
    <div className="cliente-container">
      <nav className="cliente-navbar">
        <img src="./IMG/logoblanco.png" alt="Logo" className="cliente-logo" />
        <ul>
          <li><Link to="/Dashboard">Dashboard</Link></li>
          <li><Link to="/nuevo-cliente">Nuevo cliente</Link></li>
          <li><Link to="/Pago">Pagos</Link></li>
          <li><Link to="/ListadoClientes">Clientes</Link></li>
          <li><Link to="/CorteDelDia">Cortes</Link></li>
        </ul>
        <div className="cliente-user-icon"><Link to="/PerfilUsuario">Perfil</Link>👤</div>
      </nav>

      <h2 className="cliente-title">Pago</h2>

      <div className="busqueda-container">
        <input
          type="text"
          placeholder="Buscar cliente por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda-input"
        />
      </div>

      <table className="cliente-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha de pago</th>
            <th>Fecha último pago</th>
            <th>Dirección IP</th>
            <th>Dirección</th>
            <th>Conexión</th>
            <th>Costo paquete</th>
            <th>Acción</th>
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
              <td>
                <button
                  className="btn-guardar"
                  onClick={() => handleSeleccionarCliente(cliente)}
                >
                  Seleccionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {clienteSeleccionado && (
        <div className="ticket-resultado">
          <h3>Cliente seleccionado: {clienteSeleccionado.nombre}</h3>
          <label>
            Meses pagados:
            <input
              type="number"
              value={mesesPagados}
              onChange={(e) => setMesesPagados(parseInt(e.target.value))}
              min="1"
              className="busqueda-input"
            />
          </label>
          <label>
            Precio paquete:
            <input
              type="number"
              value={precioPaquete}
              onChange={(e) => setPrecioPaquete(parseFloat(e.target.value))}
              className="busqueda-input"
            />
          </label>
          <label>
            Descripción del ticket:
            <input
              type="text"
              value={descripcionTicket}
              onChange={(e) => setDescripcionTicket(e.target.value)}
              className="busqueda-input"
            />
          </label>
          <div style={{ marginTop: '10px' }}>
            <button className="btn-guardar" onClick={handleGenerarPago}>
              Generar Pago y Ticket (descargar PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pago;
