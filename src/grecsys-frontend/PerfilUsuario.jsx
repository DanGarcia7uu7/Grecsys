import React, { useEffect, useState } from "react";
import "../styles/perfil.css";
import { Link, useNavigate } from "react-router-dom";

export default function Perfil({ usuario = {}, api = { baseUrl: "/api", token: "" } }) {
  const navigate = useNavigate(); // 👈 para redirigir
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);

  const [perfil, setPerfil] = useState({
    id_usuarios: "",
    cliente_id: "",
    usuario: "",
    correo: "",
    activo: true,
    fecha_creacion: null,
    ultimo_login: null,
  });

  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviandoSoporte, setEnviandoSoporte] = useState(false);

  const fmtDate = (d) => (d ? new Date(d).toLocaleString("es-MX") : "—");

  // 🔹 Función para cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem("token"); // O lo que uses para guardar sesión
    sessionStorage.clear(); // Limpia cualquier dato temporal
    navigate("/"); // Redirige al inicio
  };

  useEffect(() => {
    let cancel = false;
    async function cargar() {
      try {
        setCargando(true);
        setError("");
        const id = usuario?.id ?? "me";
        const res = await fetch(`${api.baseUrl}/usuarios/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(api?.token ? { Authorization: `Bearer ${api.token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancel) return;
        setPerfil({
          id_usuarios: data.id_usuarios ?? data.id ?? "",
          cliente_id: data.cliente_id ?? "",
          usuario: data.usuario ?? "",
          correo: data.correo ?? data.email ?? "",
          activo: Boolean(data.activo ?? true),
          fecha_creacion: data.fecha_creacion ?? null,
          ultimo_login: data.ultimo_login ?? null,
        });
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
  }, [api?.baseUrl, api?.token, usuario?.id]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPerfil((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const guardar = async () => {
    try {
      setCargando(true);
      setError("");
      const id = usuario?.id ?? perfil.id_usuarios ?? "me";
      const payload = {
        cliente_id: perfil.cliente_id === "" ? null : Number(perfil.cliente_id),
        usuario: perfil.usuario,
        correo: perfil.correo,
        activo: perfil.activo ? 1 : 0,
      };
      const res = await fetch(`${api.baseUrl}/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(api?.token ? { Authorization: `Bearer ${api.token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setEdit(false);
      alert("Perfil actualizado ✔");
    } catch (e) {
      console.error(e);
      setError("No se pudo guardar el perfil.");
    } finally {
      setCargando(false);
    }
  };

  const enviarSoporte = async () => {
    if (!asunto.trim() || !mensaje.trim()) {
      alert("Completa asunto y mensaje");
      return;
    }
    try {
      setEnviandoSoporte(true);
      const body = {
        usuario_id: perfil.id_usuarios || usuario?.id || null,
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
          <li className='activo'><Link to="/Dashboard">Dashboard</Link></li>
          <li><Link to="/nuevo-cliente">Nuevo cliente</Link></li>
          <li><Link to="/ticket">Pagos</Link></li>
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
          <div className="perfil-avatar" aria-hidden>
            👤
          </div>
          <div>
            <h3 className="perfil-nombre">{perfil.usuario || "Usuario"}</h3>
            <div className={`perfil-badge ${perfil.activo ? "ok" : "off"}`}>
              {perfil.activo ? "Activo" : "Suspendido"}
            </div>
            <div className="perfil-sub">
              Último login: {fmtDate(perfil.ultimo_login)}
            </div>
          </div>
        </div>
      </section>

      {error && <div className="perfil-error">{error}</div>}

      {cargando ? (
        <div className="perfil-skel-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skel" />
          ))}
        </div>
      ) : (
        <section className="perfil-grid">
          <div className="perfil-card">
            <div className="p-field">
              <label>Usuario</label>
              <input
                name="usuario"
                value={perfil.usuario}
                onChange={onChange}
                disabled={!edit}
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
              <label
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
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

      <section className="perfil-card" style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0, color: "#2f3a85" }}>Soporte técnico</h3>
        <div className="p-field">
          <label>Asunto</label>
          <input
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            placeholder="Ej. Problemas con el pago"
          />
        </div>
        <div className="p-field">
          <label>Mensaje</label>
          <textarea
            className="p-textarea"
            rows={5}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Describe tu problema o duda"
          />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            className="btn-azul"
            onClick={enviarSoporte}
            disabled={enviandoSoporte || !asunto.trim() || !mensaje.trim()}
          >
            {enviandoSoporte ? "Enviando…" : "Enviar a soporte"}
          </button>
        </div>
      </section>
    </div>
  );
}
