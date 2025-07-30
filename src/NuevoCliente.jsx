import React, { useState } from 'react';
import './style.css';

const NuevoCliente = () => {
  const [formData, setFormData] = useState({
    noCliente: '',
    nombre: '',
    direccion: '',
    fechaPago: '',
    conexion: '',
    contrasena: '',
    telefono: '',
    ip: '',
    costo: '',
  });

  const [mensajeExito, setMensajeExito] = useState(false); // <- NUEVO estado

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cliente guardado:', formData);

    // Aquí podrías conectar con tu backend
    setMensajeExito(true); // Mostrar mensaje

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => setMensajeExito(false), 3000);
  };

  const handleCancelar = () => {
    setFormData({
      noCliente: '',
      nombre: '',
      direccion: '',
      fechaPago: '',
      conexion: '',
      contrasena: '',
      telefono: '',
      ip: '',
      costo: '',
    });
    setMensajeExito(false); // Ocultar mensaje si estaba visible
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

      {/* Formulario principal */}
      <h2 className="cliente-title">Nuevo cliente</h2>

      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="mensaje-exito">
          Cliente guardado exitosamente!!!
        </div>
      )}

      <form onSubmit={handleSubmit} className="cliente-form">
        <div className="cliente-form-columns">
          <div className="form-column">
            <label>No. Cliente</label>
            <input name="noCliente" value={formData.noCliente} onChange={handleChange} />

            <label>Nombre cliente</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} />

            <label>Dirección</label>
            <input name="direccion" value={formData.direccion} onChange={handleChange} />

            <label>Fecha de pago</label>
            <input type="date" name="fechaPago" value={formData.fechaPago} onChange={handleChange} />

            <label>Conexión</label>
            <select name="conexion" value={formData.conexion} onChange={handleChange}>
              <option value="">Selecciona</option>
              <option value="fibra">Fibra</option>
              <option value="inalámbrico">Antena</option>
            </select>
          </div>

          <div className="form-column">
            <label>Contraseña</label>
            <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} />

            <label>No. Teléfono</label>
            <input name="telefono" value={formData.telefono} onChange={handleChange} />

            <label>IP</label>
            <input name="ip" value={formData.ip} onChange={handleChange} />

            <label>Costo del paquete</label>
            <input name="costo" value={formData.costo} onChange={handleChange} />
          </div>
        </div>

        {/* Botones abajo del formulario */}
        <div className="form-buttons">
          <button type="submit" className="btn-guardar">Guardar cliente</button>
          <button type="button" className="btn-cancelar" onClick={handleCancelar}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default NuevoCliente;
