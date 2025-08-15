import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/style.css';

const NuevoCliente = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    ip: '',
    contrasena: '',
    conexion: '',
    costo_paquete: '',
    fecha_pago: ''
  });

  const [mensajeExito, setMensajeExito] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMensajeExito(true);
        setTimeout(() => setMensajeExito(false), 3000);
        setFormData({
          nombre: '',
          direccion: '',
          telefono: '',
          ip: '',
          contrasena: '',
          conexion: '',
          costo_paquete: '',
          fecha_pago: ''
        });
      } else {
        console.error('Error al insertar cliente');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  const handleCancelar = () => {
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      ip: '',
      contrasena: '',
      conexion: '',
      costo_paquete: '',
      fecha_pago: ''
    });
    setMensajeExito(false);
  };

  return (
    <div className="cliente-container">
      <nav className="cliente-navbar">
        <img src="./IMG/logoblanco.png" alt="Logo" className="cliente-logo" />
        <ul>
          <li className='activo'><Link to="/Dashboard">Dashboard</Link></li>
          <li><Link to="/nuevo-cliente">Nuevo cliente</Link></li>
          <li><Link to="/Pago">Pagos</Link></li>
          <li><Link to="/ListadoClientes">Clientes</Link></li>
          <li><Link to="/CorteDelDia">Cortes</Link></li>
        </ul>
        <div className="cliente-user-icon"><Link to="/PerfilUsuario">Perfil</Link>👤</div>
      </nav>

      <h2 className="cliente-title">Nuevo cliente</h2>

      {mensajeExito && <div className="mensaje-exito">Cliente guardado exitosamente!!!</div>}

      <form onSubmit={handleSubmit} className="cliente-form">
        <div className="cliente-form-columns">
          <div className="form-column">
            <label>Nombre</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} />

            <label>Dirección</label>
            <input name="direccion" value={formData.direccion} onChange={handleChange} />

            <label>No. Teléfono</label>
            <input name="telefono" value={formData.telefono} onChange={handleChange} />

            <label>IP</label>
            <input name="ip" value={formData.ip} onChange={handleChange} />
          </div>

          <div className="form-column">
            <label>Contraseña</label>
            <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} />

            <label>Conexión</label>
            <select name="conexion" value={formData.conexion} onChange={handleChange}>
              <option value="">Selecciona</option>
              <option value="fibra">Fibra</option>
              <option value="inalámbrico">Antena</option>
            </select>

            <label>Costo del paquete</label>
            <input name="costo_paquete" value={formData.costo_paquete} onChange={handleChange} />

            <label>Fecha de pago</label>
            <input type="date" name="fecha_pago" value={formData.fecha_pago} onChange={handleChange} />
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-guardar">Guardar cliente</button>
          <button type="button" className="btn-cancelar" onClick={handleCancelar}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default NuevoCliente;
