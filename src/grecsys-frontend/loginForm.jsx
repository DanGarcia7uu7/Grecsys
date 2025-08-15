import React, { useState } from 'react';
import '../styles/style.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!nombre || !contrasena) {
      alert('Por favor completa nombre y contraseña');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login exitoso:', data);
        // Guardar datos del usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify({ nombre: data.nombre }));
        // Redirigir al Dashboard
        navigate('/Dashboard');
      } else {
        alert(data.mensaje || 'Error en el login');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Bienvenido/a</h1>
        <div className="logo-text-container">
          <img src="../IMG/logo.png" alt="logo-img" className="logo-img" />
          <img src="../IMG/letras.png" alt="Texto GrecSys" className="title-img" />
        </div>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <h2>Inicia sesión para continuar</h2>

        <div className="input-group">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa tu nombre"
          />
        </div>

        <div className="input-group password-wrapper">
          <label>Contraseña</label>
          <input
            type={verContrasena ? 'text' : 'password'}
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Ingresa tu contraseña"
          />
          <button
            type="button"
            onClick={() => setVerContrasena(!verContrasena)}
          >
            {verContrasena ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <button type="submit" className="login-button">
          Iniciar sesión
        </button>


      </form>
    </div>
  );
};

export default LoginForm;
