import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (usuario && contrasena) {
      console.log('Usuario:', usuario);
      console.log('Contraseña:', contrasena);
      navigate('/nuevo-cliente'); 
    } else {
      alert('Por favor completa usuario y contraseña');
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
          <label>Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ingresa tu usuario"
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
            {verContrasena }
          </button>
        </div>

        <button type="submit" className="login-button">
          Iniciar sesión
        </button>

        <div className="forgot-password">
          <a href="/olvide">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
