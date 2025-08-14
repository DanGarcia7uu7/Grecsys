import React, { useMemo, useState, useEffect } from 'react';
import '../styles/dashboard.css';
import { Link } from "react-router-dom";


function BigChart({ title = 'Gráfica', data = [], labels = [], unit = '' }) {
  const W = 1000;
  const H = 360;
  const P = { top: 16, right: 18, bottom: 36, left: 44 };
  const serie = Array.isArray(data) && data.length ? data : [2, 4, 3, 7, 6, 9, 8, 12, 10, 7, 5, 3];
  const n = serie.length;
  const innerW = W - P.left - P.right;
  const innerH = H - P.top - P.bottom;
  const max = Math.max(...serie, 1);
  const sum = useMemo(() => serie.reduce((a, b) => a + Number(b || 0), 0), [serie]);

  const barSpace = n ? innerW / n : innerW;
  const barWidth = Math.max(10, barSpace * 0.56);
  const xBar = (i) => P.left + i * barSpace + (barSpace - barWidth) / 2;
  const yVal = (v) => P.top + innerH - (v / max) * innerH;
  const xLine = (i) => xBar(i) + barWidth / 2;
  const lineD = serie.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xLine(i)} ${yVal(v)}`).join(' ');

  const yTicks = 4;
  const yTickVal = (k) => Math.round((max * k) / yTicks);
  const xMarks = [0, Math.floor(n / 3), Math.floor((2 * n) / 3), n - 1].filter((i) => i >= 0);
  const xLabel = (i) => (labels && labels[i] ? labels[i] : `H${i + 1}`);

  const [hover, setHover] = useState({ i: null, cx: 0, cy: 0 });
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const onMove = (e) => {
    if (!n) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left - P.left;
    const i = clamp(Math.floor(localX / (innerW / n)), 0, n - 1);
    setHover({ i, cx: xLine(i), cy: yVal(serie[i]) });
  };
  const onLeave = () => setHover({ i: null, cx: 0, cy: 0 });

  return (
    <section className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-legend">
          <span className="legend-dot" />
          <span>{unit || 'Serie'}</span>
          <span className="chart-sub">Total: <strong>{sum}</strong></span>
        </div>
      </div>

      <div className="chart-wrapper">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" role="img" aria-label={title}>
          <defs>
            <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7a8eea" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#7a8eea" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7a8eea" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7a8eea" stopOpacity="0.06" />
            </linearGradient>
          </defs>

          <g className="chart-grid">
            {Array.from({ length: yTicks + 1 }).map((_, k) => {
              const yy = P.top + (k * innerH) / yTicks;
              return <line key={k} x1={P.left} y1={yy} x2={P.left + innerW} y2={yy} />;
            })}
          </g>

          <g>
            {serie.map((v, i) => (
              <rect
                key={i}
                className="chart-bar"
                x={xBar(i)}
                y={yVal(v)}
                width={barWidth}
                height={P.top + innerH - yVal(v)}
                rx={8}
                ry={8}
              />
            ))}
          </g>

          <path d={`${lineD} L ${xLine(n - 1)} ${P.top + innerH} L ${xLine(0)} ${P.top + innerH} Z`} className="chart-area" />
          <path d={lineD} className="chart-stroke" />

          <g>
            {Array.from({ length: yTicks + 1 }).map((_, k) => {
              const yy = P.top + (k * innerH) / yTicks;
              const val = yTickVal(yTicks - k);
              return (
                <text key={k} x={P.left - 8} y={yy + 4} className="chart-y" textAnchor="end">{val}</text>
              );
            })}
          </g>

          <g>
            {xMarks.map((i) => (
              <text key={i} x={xLine(i)} y={P.top + innerH + 22} className="chart-x" textAnchor="middle">{xLabel(i)}</text>
            ))}
          </g>

          <rect
            x={P.left}
            y={P.top}
            width={innerW}
            height={innerH}
            fill="transparent"
            onMouseMove={onMove}
            onMouseLeave={onLeave}
          />
          {hover.i !== null && (
            <>
              <line x1={hover.cx} x2={hover.cx} y1={P.top} y2={P.top + innerH} className="chart-guide" />
              <circle cx={hover.cx} cy={hover.cy} r="5" className="chart-dot" />
            </>
          )}
        </svg>

        {hover.i !== null && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(hover.cx / W) * 100}%`,
              top: `${(hover.cy / H) * 100}%`
            }}
          >
            <div className="tt-label">{xLabel(hover.i)}</div>
            <div className="tt-value"><strong>{serie[hover.i]}</strong> {unit}</div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Dashboard({
  usuario = { nombre: 'Usuario' },
  series = {
    pagosHoy: { data: [], labels: [] },
    clientesNuevos: { data: [], labels: [] },
    pagosAcumulados: { data: [], labels: [] },
    clientesRegistrados: { data: [], labels: [] }
  },
  metricas = {},
}) {
  const sPagos = series?.pagosHoy?.data || [];
  const sPagosLabels = series?.pagosHoy?.labels || [];
  const sNuevos = series?.clientesNuevos?.data || [];
  const sNuevosLabels = series?.clientesNuevos?.labels || [];
  const sAcum = series?.pagosAcumulados?.data || [];
  const sAcumLabels = series?.pagosAcumulados?.labels || [];
  const sReg = series?.clientesRegistrados?.data || [];
  const sRegLabels = series?.clientesRegistrados?.labels || [];

  const sum = (arr) => arr.reduce((a, b) => a + Number(b || 0), 0);
  const last = (arr, d = 0) => (arr.length ? arr[arr.length - 1] : d);

  const kpisCalc = {
    pagosHoy: metricas.pagosHoy ?? sum(sPagos),
    clientesNuevos: metricas.clientesNuevos ?? sum(sNuevos),
    pagosAcumulados: metricas.pagosAcumulados ?? sum(sAcum),
    clientesRegistrados: metricas.clientesRegistrados ?? last(sReg, 0),
  };

  const cards = [
    { key: 'pagosHoy', label: 'Pagos de hoy', tone: 'kpi-amarillo', data: sPagos, labels: sPagosLabels, unit: 'pagos' },
    { key: 'clientesNuevos', label: 'Clientes nuevos', tone: 'kpi-morado', data: sNuevos, labels: sNuevosLabels, unit: 'clientes' },
    { key: 'pagosAcumulados', label: 'Pagos hasta ahora', tone: 'kpi-rosa', data: sAcum, labels: sAcumLabels, unit: 'pagos' },
    { key: 'clientesRegistrados', label: 'Clientes registrados', tone: 'kpi-azul', data: sReg, labels: sRegLabels, unit: 'clientes' },
  ];

  const [activeKey, setActiveKey] = useState('pagosHoy');
  const active = cards.find((c) => c.key === activeKey) || cards[0];

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
        <div className="cliente-user-icon"><Link to="/PerfilUsuario">Perfil</Link>👤</div>
      </nav>

      <section className="dash-hero">
        <div className="dash-hero-text">
          <h3>Hola, {usuario?.nombre || 'Usuario'}</h3>
          <p>Resumen de hoy con datos conectados a tus KPIs.</p>
        </div>
        <div className="dash-hero-illu" aria-hidden>💻</div>
      </section>

      <section className="dash-stats">
        {cards.map((c) => (
          <button
            key={c.key}
            className={`dash-card ${c.tone} ${activeKey === c.key ? 'kpi-active' : ''}`}
            onClick={() => setActiveKey(c.key)}
            type="button"
          >
            <div className="dash-card-value">{kpisCalc[c.key]}</div>
            <div className="dash-card-label">{c.label}</div>
          </button>
        ))}
      </section>

      <BigChart title={active.label} data={active.data} labels={active.labels} unit={active.unit} />
    </div>
  );
}
