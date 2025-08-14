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
        Escribe tu correo electronico<br />
        Recibirás un correo con la contraseña
      </p>

      <form onSubmit={handleSubmit}>
  <label className="forgot-label">Escribe tu correo electronico: </label>
  <input
    type="text"
    className="forgot-input"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Correo Electronico"
  />
  <button type="submit" className="forgot-button">
    Solicitar contraseña
  </button>
  <button type="submit" className="forgot-button">
    Solicitar contraseña
  </button>
</form>
    </div>
  );
};

export default ForgotPassword;
