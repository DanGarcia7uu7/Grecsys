import React, { useMemo, useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/corte.css';

const CorteDelDia = ({ registrosIniciales = [] }) => {
  // Datos de ejemplo o de props
  const registrosBase = registrosIniciales.length ? registrosIniciales : [
    { nombre: 'María Pérez', fechaPago: '2025-08-13', meses: 1, precio: 350, total: 350 },
    { nombre: 'Juan López',  fechaPago: '2025-08-13', meses: 2, precio: 300, total: 600 },
    { nombre: 'Ana García',  fechaPago: '2025-08-12', meses: 1, precio: 400, total: 400 },
  ];

  // Fecha de hoy
  const hoy = new Date().toISOString().split('T')[0];

  // Filtramos solo los pagos de hoy
  const registrosHoy = registrosBase.filter(r => r.fechaPago === hoy);

  // Calcular total del día
  const totalDia = useMemo(
    () =>
      registrosHoy.reduce(
        (acc, r) => acc + (Number(r.total) || (Number(r.meses) * Number(r.precio) || 0)),
        0
      ),
    [registrosHoy]
  );

  return (
    <div className="cliente-container">
      <nav className="cliente-navbar">
        <img src="./IMG/logoblanco.png" alt="Logo" className="cliente-logo" />
        <ul>
          <li><Link to="/nuevo-cliente">Nuevo cliente</Link></li>
          <li><Link to="/ticket">Ticket</Link></li>
          <li><Link to="/ListadoClientes">Clientes</Link></li>
          <li><Link to="/CorteDelDia">Cortes</Link></li>
        </ul>
        <div className="cliente-user-icon"><Link to="/PerfilUsuario">Perfil</Link>👤</div>
      </nav>

      <h2 className="cliente-title">Corte del día ({hoy})</h2>

      <div className="corte-card">
        <table className="corte-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha de pago</th>
              <th>Meses de pago</th>
              <th>Precio paquete</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {registrosHoy.length === 0 ? (
              <tr>
                <td className="corte-empty" colSpan={5}>
                  No hay registros para hoy
                </td>
              </tr>
            ) : (
              registrosHoy.map((r, i) => (
                <tr key={i}>
                  <td>{r.nombre}</td>
                  <td>{r.fechaPago}</td>
                  <td>{r.meses}</td>
                  <td>${Number(r.precio).toFixed(2)}</td>
                  <td>${(Number(r.total) || Number(r.meses) * Number(r.precio)).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="corte-resumen">
          <span>Registros: {registrosHoy.length}</span>
          <span>Total del día: <strong>${totalDia.toFixed(2)}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default CorteDelDia;
