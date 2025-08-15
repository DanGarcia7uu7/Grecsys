import React, { useEffect, useState } from "react";
import "../styles/perfil.css";
import { Link, useNavigate } from "react-router-dom";

export default function Perfil({ api = { baseUrl: "/api", token: "" } }) {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);

  const usuarioLogeado = JSON.parse(localStorage.getItem("usuario")) || {};

  const [perfil, setPerfil] = useState({
    id_usuarios: "",
    cliente_id: "",
    usuario: usuarioLogeado.nombre || "",
    correo: usuarioLogeado.correo || "",
    activo: true,
    fecha_creacion: null,
    ultimo_login: null,
  });

  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviandoSoporte, setEnviandoSoporte] = useState(false);

  const fmtDate = (d) => (d ? new Date(d).toLocaleString("es-MX") : "—");

  // Cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    sessionStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    let cancel = false;
    async function cargar() {
      try {
        setCargando(true);
        setError("");
        const id = usuarioLogeado.id ?? "me";
        const res = await fetch(`${api.baseUrl}/usuarios/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(api?.token ? { Authorization: `Bearer ${api.token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancel) return;
        setPerfil((p) => ({
          ...p,
          id_usuarios: data.id_usuarios ?? data.id ?? "",
          cliente_id: data.cliente_id ?? "",
          correo: data.correo ?? data.email ?? p.correo,
          activo: Boolean(data.activo ?? true),
          fecha_creacion: data.fecha_creacion ?? null,
          ultimo_login: data.ultimo_login ?? null,
        }));
      } catch (e) {
        console.error(e);
        if (!cancel) setError("No se pudo cargar el perfil.");
      } finally {
        if (!cancel) setCargando(false);
      }
    }
    cargar();
    return () => {
      cancel = true;
    };
  }, [api?.baseUrl, api?.token, usuarioLogeado.id]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPerfil((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const enviarSoporte = async () => {
    if (!asunto.trim() || !mensaje.trim()) {
      alert("Completa asunto y mensaje");
      return;
    }
    try {
      setEnviandoSoporte(true);
      const body = {
        usuario_id: perfil.id_usuarios || usuarioLogeado.id || null,
        usuario: perfil.usuario,
        correo: perfil.correo || null,
        asunto,
        mensaje,
      };
      const res = await fetch(`${api.baseUrl}/soporte/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(api?.token ? { Authorization: `Bearer ${api.token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setAsunto("");
      setMensaje("");
      alert("Tu solicitud de soporte fue enviada ✅");
    } catch (e) {
      console.error(e);
      alert("No se pudo enviar la solicitud de soporte");
    } finally {
      setEnviandoSoporte(false);
    }
  };

  return (
    <div className="cliente-container">
      <nav className="cliente-navbar">
        <img src="./IMG/logoblanco.png" alt="Logo" className="cliente-logo" />
        <ul>
          <li><Link to="/Dashboard">Dashboard</Link></li>
          <li><Link to="/nuevo-cliente">Nuevo cliente</Link></li>
          <li><Link to="/Pago">Pagos</Link></li>
          <li><Link to="/ListadoClientes">Clientes</Link></li>
          <li><Link to="/CorteDelDia">Cortes</Link></li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={cerrarSesion} className="btn-rojo">
            Cerrar sesión
          </button>
        </div>
      </nav>

      <h2 className="cliente-title">Perfil</h2>

      <section className="perfil-header">
        <div className="perfil-header-left">
          <div className="perfil-avatar" aria-hidden>👤</div>
          <div>
            <h3 className="perfil-nombre">{usuarioLogeado.nombre || "Usuario"}</h3>
            <div className={`perfil-badge ${perfil.activo ? "ok" : "off"}`}>
              {perfil.activo ? "Activo" : "Suspendido"}
            </div>
            <div className="perfil-sub">Último login: {fmtDate(perfil.ultimo_login)}</div>
          </div>
        </div>
      </section>

      {error && <div className="perfil-error">{error}</div>}

      {cargando ? (
        <div className="perfil-skel-grid">
          {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="skel" />))}
        </div>
      ) : (
        <section className="perfil-grid">
          <div className="perfil-card">
            <div className="p-field">
              <label>Usuario</label>
              <input
                name="usuario"
                value={usuarioLogeado.nombre || perfil.usuario || ""}
                disabled
              />
            </div>
            <div className="p-field">
              <label>Correo</label>
              <input
                type="email"
                name="correo"
                value={perfil.correo}
                onChange={onChange}
                disabled={!edit}
                placeholder="nombre@dominio.com"
              />
            </div>
          </div>

          <div className="perfil-card">
            <div className="p-field">
              <label>Activo</label>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  name="activo"
                  checked={!!perfil.activo}
                  onChange={onChange}
                  disabled={!edit}
                />
                {perfil.activo ? "Sí" : "No"}
              </label>
            </div>
            <div className="p-field">
              <label>Fecha de creación</label>
              <input value={fmtDate(perfil.fecha_creacion)} disabled />
            </div>
            <div className="p-field">
              <label>Último login</label>
              <input value={fmtDate(perfil.ultimo_login)} disabled />
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
