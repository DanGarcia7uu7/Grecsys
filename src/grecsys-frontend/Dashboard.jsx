import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/dashboard.css';

export default function Dashboard() {
    const [totalClientes, setTotalClientes] = useState(0);
    const [pagosHoy, setPagosHoy] = useState([]);
    const [usuario, setUsuario] = useState({ nombre: 'Usuario' });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Obtener total de clientes de la API
        fetch('http://localhost:3001/api/total-clientes')
            .then(res => res.json())
            .then(data => setTotalClientes(data.total || 0))
            .catch(err => console.error('Error al obtener el total de clientes:', err));

        // Obtener pagos de hoy de la API (más eficiente)
        fetch('http://localhost:3001/api/pagos-hoy')
            .then(res => res.json())
            .then(data => setPagosHoy(data || []))
            .catch(err => console.error('Error al obtener pagos del día:', err));

        // Obtener usuario guardado en localStorage
        const userData = localStorage.getItem('usuario');
        if (userData) {
            setUsuario(JSON.parse(userData));
        }

        setCargando(false);
    }, []);

    const totalPagosHoy = pagosHoy.reduce((acc, pago) => acc + (Number(pago.total || 0)), 0);

    return (
        <div className="cliente-container">
            <nav className="cliente-navbar">
                <img src="/IMG/logoblanco.png" alt="Logo" className="cliente-logo" />
                <ul>
                    <li><Link to="/Dashboard">GrecSys</Link></li>
                    <li><Link to="/nuevo-cliente">Nuevo cliente</Link></li>
                    <li><Link to="/Pago">Pagos</Link></li>
                    <li><Link to="/ListadoClientes">Clientes</Link></li>
                    <li><Link to="/CorteDelDia">Cortes</Link></li>
                </ul>
                <div className="cliente-user-icon">
                    <Link to="/PerfilUsuario">
                        Mi cuenta
                        <img src="/IMG/usuario.png" alt="Ícono de perfil" />
                    </Link>
                </div>
            </nav>

            <section className="dash-hero">
              <div className="dash-hero-text">
                <h3>Bienvenido, {usuario?.nombre || 'Usuario'} :3</h3>
                <h3>Paquetes mas solicitado por el cliente</h3>
              </div>
              <div className="dash-hero-illu" aria-hidden>💻</div>
            </section>

            <section className="dash-paquetes">
                <div className="dash-paquete-card">
                    <div className="paquete-header">
                        <span>15 Megas</span>
                        <span className="precio">$280 <small>al mes</small></span>
                    </div>
                    <div className="paquete-body">
                        <ul>
                            <li>Conexion via fibra o antena</li>
                            <li>Por 100 pesos adicionales incluye:</li>
                            <li>TV con más 3500 canales libres</li>
                            <li>películas y series ilimitadas</li>
                        </ul>
                    </div>
                </div>

                <div className="dash-paquete-card">
                    <div className="paquete-header">
                        <span>20 Megas</span>
                        <span className="precio">$300 <small>al mes</small></span>
                    </div>
                    <div className="paquete-body">
                        <ul>
                            <li>Conexion via fibra o antena</li>
                            <li>Por 100 pesos adicionales incluye:</li>
                            <li>TV con más 3500 canales libres</li>
                            <li>películas y series ilimitadas</li>
                        </ul>
                    </div>
                </div>

                <div className="dash-paquete-card">
                    <div className="paquete-header">
                        <span>30 Megas</span>
                        <span className="precio">$350 <small>al mes</small></span>
                    </div>
                    <div className="paquete-body">
                        <ul>
                            <li>Conexion via fibra o antena</li>
                            <li>Por 100 pesos adicionales incluye:</li>
                            <li>TV con más 3500 canales libres</li>
                            <li>películas y series ilimitadas</li>
                        </ul>
                    </div>
                </div>

                <div className="dash-paquete-card">
                    <div className="paquete-header">
                        <span>50 Megas</span>
                        <span className="precio">$450 <small>al mes</small></span>
                    </div>
                    <div className="paquete-body">
                        <ul>
                            <li>Conexion via fibra o antena</li>
                            <li>Por 100 pesos adicionales incluye:</li>
                            <li>TV con más 3500 canales libres</li>
                            <li>películas y series ilimitadas</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}