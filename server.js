import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  user: 'admin',
  password: 'admin',
  server: 'DESKTOP-C84JDK3',
  database: 'grecsys_db',
  options: {
    encrypt: false,
    trustServerCertificate: true,
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
  console.log('Datos recibidos en /api/clientes:', req.body);

  // Asignar valores por defecto primero
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

  // Validación de campos obligatorios
  const requiredFields = [
    'nombre',
    'direccion',
    'telefono',
    'ip',
    'contrasena',
    'conexion',
    'costo_paquete',
    'fecha_pago',
    'fecha_ultimo_pago',
    'activo'
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


// ====================== Buscar CLIENTE ======================

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



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
