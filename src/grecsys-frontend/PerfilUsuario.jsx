import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../styles/style.css';

const PerfilUsuario = () => {
  const navigate = useNavigate();

  // Estado para los números dinámicos
  const [resumen, setResumen] = useState({
    clientesRegistrados: 120,
    pagosDelDia: 25,
    clientesNuevos: 6,
  });

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    usuario: '',
    rol: '',
  });

  const [mensajeExito, setMensajeExito] = useState(false);

  // Cargar datos del usuario desde localStorage de manera segura
  useEffect(() => {
    try {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado && usuarioGuardado !== 'undefined') {
        setFormData(JSON.parse(usuarioGuardado));
      }
    } catch (error) {
      console.error('Error al cargar usuario desde localStorage', error);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Perfil actualizado:', formData);
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);

    // Guardar cambios también en localStorage
    localStorage.setItem('usuario', JSON.stringify(formData));
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario'); // Elimina usuario de localStorage
    navigate('/'); // Redirige al login
  };

  return (
    <div className="cliente-container">
      {/* Barra superior de navegación */}
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

      {/* Título */}
      <h2 className="cliente-title">Perfil de Usuario</h2>



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

            <label>Rol</label>
            <input name="rol" value={formData.rol} onChange={handleChange} />
          </div>
        </div>

        {/* Botones */}
        <div className="form-buttons">
          <button type="submit" className="btn-guardar">Actualizar perfil</button>
          <button type="button" className="btn-cerrar" onClick={handleCerrarSesion}>Cerrar sesión</button>
        </div>
      </form>
    </div>
  );
};

export default PerfilUsuario;
