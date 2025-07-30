import React, { useState } from 'react';
import './style.css';

const PerfilUsuario = () => {
  // Estado para los números dinámicos
  const [resumen, setResumen] = useState({
    clientesRegistrados: 120,
    pagosDelDia: 25,
    clientesNuevos: 6,
  });

  const [formData, setFormData] = useState({
    nombre: 'Juan Pérez',
    correo: 'juanperez@gmail.com',
    telefono: '555-123-4567',
    direccion: 'Calle Falsa 123',
    usuario: 'juanp',
    rol: 'Administrador',
  });

  const [mensajeExito, setMensajeExito] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Perfil actualizado:', formData);
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);
  };

  const handleCancelar = () => {
    setMensajeExito(false);
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
      <h2 className="cliente-title">Perfil de Usuario</h2>

      {/* Tarjetas resumen dinámicas */}
      <div className="resumen-container">
        <div className="resumen-card clientes-registrados">
          <h3>Registros</h3>
          <p>{resumen.clientesRegistrados}</p>
        </div>
        <div className="resumen-card pagos-dia">
          <h3>Pagos del día</h3>
          <p>{resumen.pagosDelDia}</p>
        </div>
        <div className="resumen-card clientes-nuevos">
          <h3>Clientes nuevos</h3>
          <p>{resumen.clientesNuevos}</p>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="mensaje-exito">
          Perfil actualizado exitosamente!!!
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="cliente-form">
        <div className="cliente-form-columns">
          <div className="form-column">
            <label>Nombre</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} />

            <label>Correo</label>
            <input name="correo" value={formData.correo} onChange={handleChange} />

            <label>Teléfono</label>
            <input name="telefono" value={formData.telefono} onChange={handleChange} />
          </div>

          <div className="form-column">
            <label>Dirección</label>
            <input name="direccion" value={formData.direccion} onChange={handleChange} />

            <label>Usuario</label>
            <input name="usuario" value={formData.usuario} onChange={handleChange} />

            <label>Rol</label>
            <input name="rol" value={formData.rol} onChange={handleChange} />
          </div>
        </div>

        {/* Botones */}
        <div className="form-buttons">
          <button type="submit" className="btn-guardar">Actualizar perfil</button>
          <button type="button" className="btn-cancelar" onClick={handleCancelar}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default PerfilUsuario;
