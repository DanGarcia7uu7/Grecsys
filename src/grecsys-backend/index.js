const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Configuración de conexión a SQL Server
const config = {
  user: 'admin',
  password: 'admin',
  server: 'DESKTOP-C84JDK3', // o tu IP / nombre del servidor
  database: 'GRECSYS',
  options: {
    trustServerCertificate: true,
  },
};

// Ruta de login
app.post('/login', async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    await sql.connect(config);

    const result = await sql.query`SELECT * FROM administrador WHERE usuario = ${usuario} AND contrasena_hash = ${contrasena}`;

    if (result.recordset.length > 0) {
      res.json({ success: true, usuario: result.recordset[0] });
    } else {
      res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas' });
    }
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ success: false, mensaje: 'Error del servidor' });
  }
});

// Ruta de clientes
app.post('/api/clientes', async (req, res) => {
  console.log('req.body:', req.body);

  const {
    nombre,
    direccion,
    telefono,
    ip,
    contrasena,
    conexion,
    costo_paquete,
    fecha_pago,
    fecha_ultimo_pago,
    activo,
    usuario_id
  } = req.body;

  // Validación que detecta campos vacíos o no enviados
  const requiredFields = ['nombre', 'direccion', 'telefono', 'ip', 'contrasena', 'conexion', 'costo_paquete', 'fecha_pago'];
  const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].toString().trim() === '');

  if (missingFields.length > 0) {
    return res.status(400).json({ success: false, mensaje: `Faltan los campos: ${missingFields.join(', ')}` });
  }

  // Valores por defecto para los campos adicionales
  const fechaUltimoPago = fecha_ultimo_pago || fecha_pago;
  const activoValor = activo ?? 1;
  const usuarioIdValor = usuario_id || 1;

  try {
    await sql.connect(config);

    await sql.query`
      INSERT INTO clientes (
        nombre, direccion, telefono, ip, contrasena, conexion,
        costo_paquete, fecha_pago, fecha_ultimo_pago, activo, usuario_id
      )
      VALUES (
        ${nombre}, ${direccion}, ${telefono}, ${ip}, ${contrasena}, ${conexion},
        ${costo_paquete}, ${fecha_pago}, ${fechaUltimoPago}, ${activoValor}, ${usuarioIdValor}
      )
    `;

    res.status(201).json({ success: true, mensaje: 'Cliente insertado correctamente' });
  } catch (err) {
    console.error('Error al insertar cliente:', err);
    res.status(500).json({ success: false, mensaje: 'Error del servidor' });
  }
});



// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
