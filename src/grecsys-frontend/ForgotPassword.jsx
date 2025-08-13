import React, { useState } from 'react';
import '../styles/style.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Correo o usuario para recuperar contraseña:', email);
    // Aquí puedes llamar a tu backend o mostrar una alerta
  };

  return (
    <div className="forgot-container">
      <h2 className="forgot-title">Recuperar la contraseña</h2>
      <p className="forgot-subtext">
        Escribe tu nombre de usuario.<br />
        Recibirás un enlace para crear la contraseña nueva.
      </p>

      <form onSubmit={handleSubmit}>
  <label className="forgot-label">Nombre de usuario:</label>
  <input
    type="text"
    className="forgot-input"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="usuario o email"
  />
  <button type="submit" className="forgot-button">
    Obtener contraseña nueva
  </button>
</form>
    </div>
  );
};

export default ForgotPassword;
