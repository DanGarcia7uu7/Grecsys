import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Configuración de conexión a la base remota
const dbConfig = {
  user: 'sqlserver',           // tu usuario
  password: 'danielo8.',       // tu contraseña
  server: '34.134.21.103',     // IP de tu servidor Cloud SQL
  database: 'grecsys_db',
  options: {
    encrypt: true,             // habilitar encriptación TLS
    trustServerCertificate: false, // no confiar en certificado auto-firmado
  },
};

// ====================== LOGIN ======================
app.post('/api/login', async (req, res) => {
  const { nombre, contrasena } = req.body;

  if (!nombre || !contrasena) {
    return res.status(400).json({ mensaje: 'Faltan campos' });
  }

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT * FROM administrador WHERE nombre = ${nombre}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).json({ mensaje: 'Nombre no encontrado' });
    }

    const user = result.recordset[0];

    if (user.contrasena_hash !== contrasena) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    return res.json({ mensaje: 'Login exitoso', nombre: user.nombre });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// ====================== INSERTAR CLIENTE ======================
app.post('/api/clientes', async (req, res) => {
  const fecha_ultimo_pago = req.body.fecha_ultimo_pago || req.body.fecha_pago;
  const activo = req.body.activo !== undefined ? req.body.activo : true;

  const {
    nombre,
    direccion,
    telefono,
    ip,
    contrasena,
    conexion,
    costo_paquete,
    fecha_pago
  } = req.body;

  const requiredFields = [
    'nombre', 'direccion', 'telefono', 'ip', 'contrasena',
    'conexion', 'costo_paquete', 'fecha_pago', 'fecha_ultimo_pago', 'activo'
  ];

  const missingFields = requiredFields.filter(field => {
    if (field === 'fecha_ultimo_pago') return !fecha_ultimo_pago;
    if (field === 'activo') return activo === undefined || activo === null;
    return !req.body[field] || req.body[field].toString().trim() === '';
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      mensaje: `Faltan los campos: ${missingFields.join(', ')}`
    });
  }

  try {
    await sql.connect(dbConfig);

    await sql.query`
      INSERT INTO clientes (
        nombre, direccion, telefono, ip, contrasena, conexion,
        costo_paquete, fecha_pago, fecha_ultimo_pago, activo
      )
      VALUES (
        ${nombre}, ${direccion}, ${telefono}, ${ip}, ${contrasena}, ${conexion},
        ${costo_paquete}, ${fecha_pago}, ${fecha_ultimo_pago}, ${activo}
      )
    `;

    res.status(201).json({ success: true, mensaje: 'Cliente insertado correctamente' });
  } catch (err) {
    console.error('Error al insertar cliente:', err);
    res.status(500).json({ success: false, mensaje: 'Error del servidor' });
  }
});

// ====================== BUSCAR CLIENTES ======================
app.get('/api/clientes', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM clientes`;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, mensaje: 'Error del servidor' });
  }
});

// ====================== GENERAR PAGO Y TICKET ======================
app.post('/api/pagos-tickets', async (req, res) => {
  const { cliente_id, meses_pagados, precio_paquete, descripcion } = req.body;

  if (!cliente_id || !meses_pagados || !precio_paquete || !descripcion) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    const requestPago = new sql.Request(transaction);

    const resultPago = await requestPago.query`
      INSERT INTO pagos (cliente_id, fecha_pago, meses_pagados, precio_paquete)
      OUTPUT INSERTED.id_pagos
      VALUES (${cliente_id}, GETDATE(), ${meses_pagados}, ${precio_paquete})
    `;
    const pagoId = resultPago.recordset[0].id_pagos;

    const requestTicket = new sql.Request(transaction);
    await requestTicket.query`
      INSERT INTO tickets (pago_id, cliente_id, descripcion, estado, fecha_creacion)
      VALUES (${pagoId}, ${cliente_id}, ${descripcion}, 'Abierto', GETDATE())
    `;

    await transaction.commit();

    res.json({ mensaje: 'Pago y ticket registrados correctamente', pagoId });
  } catch (err) {
    if (pool) {
      try {
        await pool.rollback();
      } catch (rollbackErr) {
        console.error('Error al hacer rollback:', rollbackErr);
      }
    }
    console.error('Error al registrar pago y ticket:', err);
    res.status(500).json({ mensaje: 'Error al registrar pago y ticket' });
  }
});

// ====================== BUSCAR PAGOS ======================
app.get('/api/pagos-corte', async (req, res) => {
  try {
    await sql.connect(dbConfig);

    const result = await sql.query(`
      SELECT 
        c.nombre,
        p.fecha_pago,
        p.meses_pagados,
        p.precio_paquete,
        (p.meses_pagados * p.precio_paquete) AS total
      FROM pagos p
      INNER JOIN clientes c ON c.id_clientes = p.cliente_id
      WHERE CONVERT(date, p.fecha_pago) = CONVERT(date, GETDATE())
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener pagos del corte del día' });
  }
});

// ====================== DASHBOARD ======================
app.get('/api/dashboard', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const hoy = new Date().toISOString().split('T')[0];

    const pagosHoyResult = await sql.query(`
      SELECT SUM(costo_paquete) AS totalPagosHoy
      FROM clientes
      WHERE CONVERT(date, fecha_pago) = '${hoy}'
    `);

    const pagosAcumResult = await sql.query(`
      SELECT SUM(costo_paquete) AS totalPagos
      FROM clientes
    `);

    const clientesActivosResult = await sql.query(`
      SELECT COUNT(*) AS totalActivos
      FROM clientes
      WHERE activo = 1
    `);

    res.json({
      metricas: {
        pagosHoy: pagosHoyResult.recordset[0]?.totalPagosHoy || 0,
        pagosAcumulados: pagosAcumResult.recordset[0]?.totalPagos || 0,
        clientesActivos: clientesActivosResult.recordset[0]?.totalActivos || 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener datos del dashboard' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
