import React, { useState } from 'react';
import './style.css';

const Ticket = () => {
  const [nombreCliente, setNombreCliente] = useState('');
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [clienteData, setClienteData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [mensajeEliminado, setMensajeEliminado] = useState('');
  const [mensajeNoEncontrado, setMensajeNoEncontrado] = useState('');

  const handleBuscar = () => {
    const nombreNormalizado = nombreCliente.trim().toLowerCase();
    if (nombreNormalizado === 'ana bautista') {
      setClienteData({
        nombre: 'Ana Bautista',
        fechaPago: '2025-06-30',
        fechaUltimoPago: '2025-05-30',
        ip: '192.168.1.100',
        contrasena: 'abc123',
        direccion: 'Calle 123, Rosario',
        precio: '$800',
        conexion: 'Fibra',
      });
      setMensajeEliminado('');
      setMensajeNoEncontrado('');
    } else {
      setMensajeNoEncontrado('Cliente no encontrado.');
      setClienteData(null);
      setMostrarOpciones(false);
      setMensajeEliminado('');
    }
  };

  const handleModificarClick = () => {
    setMostrarOpciones(!mostrarOpciones);
  };

  const handleActualizar = () => {
    setEditable(true);
    setMostrarOpciones(false);
  };

  const handleEliminar = () => {
    setMensajeEliminado('Cliente eliminado correctamente.');
    setClienteData(null);
    setMostrarOpciones(false);
  };

  const handleInputChange = (e) => {
    setClienteData({
      ...clienteData,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setEditable(false);
    }
  };

  return (
    <div className="cliente-container">
      {/* Barra de navegación */}
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

      <h2 className="cliente-title">Ticket</h2>

      {/* Formulario */}
      <div className="ticket-form">
        <label>Nombre cliente</label>
        <input
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
          className="ticket-input"
        />
        <button className="btn-guardar" onClick={handleBuscar}>
          Buscar
        </button>

        <div className="dropdown-modificar">
          <button
            className={`btn-modificar ${!clienteData ? 'disabled' : ''}`}
            onClick={handleModificarClick}
            disabled={!clienteData}
          >
            Modificar
          </button>

          {mostrarOpciones && (
            <div className="dropdown-opciones">
              <div onClick={handleActualizar}>Actualizar</div>
              <div onClick={handleEliminar}>Eliminar</div>
            </div>
          )}
        </div>
      </div>

      {/* Mensajes */}
      {mensajeEliminado && (
        <div className="mensaje-exito">
          {mensajeEliminado}
        </div>
      )}
      {mensajeNoEncontrado && (
        <div className="mensaje-error">
          {mensajeNoEncontrado}
        </div>
      )}

      {/* Datos del cliente */}
      {clienteData && (
        <div className="ticket-resultado">
          <div className="ticket-nombre">{clienteData.nombre}</div>
          <table className="ticket-tabla">
            <thead>
              <tr>
                <th>Fecha de pago</th>
                <th>Fecha último pago</th>
                <th>IP</th>
                <th>Contraseña</th>
                <th>Dirección</th>
                <th>Precio del paquete</th>
                <th>Conexión</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {editable ? (
                    <input
                      name="fechaPago"
                      value={clienteData.fechaPago}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    clienteData.fechaPago
                  )}
                </td>
                <td>
                  {editable ? (
                    <input
                      name="fechaUltimoPago"
                      value={clienteData.fechaUltimoPago}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    clienteData.fechaUltimoPago
                  )}
                </td>
                <td>
                  {editable ? (
                    <input
                      name="ip"
                      value={clienteData.ip}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    clienteData.ip
                  )}
                </td>
                <td>
                  {editable ? (
                    <input
                      name="contrasena"
                      value={clienteData.contrasena}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    clienteData.contrasena
                  )}
                </td>
                <td>
                  {editable ? (
                    <input
                      name="direccion"
                      value={clienteData.direccion}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    clienteData.direccion
                  )}
                </td>
                <td>
                  {editable ? (
                    <input
                      name="precio"
                      value={clienteData.precio}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    clienteData.precio
                  )}
                </td>
                <td>
                  {editable ? (
                    <input
                      name="conexion"
                      value={clienteData.conexion}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    clienteData.conexion
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Ticket;
