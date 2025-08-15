import React, { useEffect, useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import '../styles/corte.css';

const CorteDelDia = () => {
  const [registrosHoy, setRegistrosHoy] = useState([]);
  const [cargando, setCargando] = useState(true);

  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/pagos-corte');
        if (res.ok) {
          const data = await res.json();
          setRegistrosHoy(data);
        } else {
          console.error('Error al obtener pagos del día');
        }
      } catch (err) {
        console.error('Error en la petición:', err);
      } finally {
        setCargando(false);
      }
    };

    fetchPagos();
  }, []);

  // Calcula la cantidad de pagos y el total del día
  const cantidadPagos = registrosHoy.length;
  const totalDia = useMemo(
    () => registrosHoy.reduce((acc, r) => acc + (Number(r.total) || 0), 0),
    [registrosHoy]
  );

  return (
    <div className="cliente-container">
      <nav className="cliente-navbar">
        <img src="/IMG/logoblanco.png" alt="Logo" className="cliente-logo" />
        <ul>
          <li><Link to="/Dashboard">Dashboard</Link></li>
          <li><Link to="/nuevo-cliente">Nuevo cliente</Link></li>
          <li><Link to="/Pago">Pagos</Link></li>
          <li><Link to="/ListadoClientes">Clientes</Link></li>
          <li><Link to="/CorteDelDia">Cortes</Link></li>
        </ul>
        <div className="cliente-user-icon">
          <Link to="/PerfilUsuario">
            Mi perfil
            <img src="/IMG/usuario.png" alt="Ícono de perfil" />
          </Link>
        </div>
      </nav>

      <h2 className="cliente-title">Corte del día</h2>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
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
                    <td>{r.fecha_pago.split('T')[0]}</td>
                    <td>{r.meses_pagados}</td>
                    <td>${Number(r.precio_paquete).toFixed(2)}</td>
                    <td>${Number(r.total).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="corte-resumen">
  <span>Registros: {cantidadPagos}</span>
  <span>Total del día: <strong>${totalDia.toFixed(2)}</strong></span>
</div>
        </div>
      )}
    </div>
  );
};

export default CorteDelDia;