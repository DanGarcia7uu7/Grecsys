import sql from 'mssql';

const config = {
  user: 'admin',
  password: 'admin',
  server: 'DESKTOP-C84JDK3',
  database: 'grecsys_db',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function testConnection() {
  try {
    await sql.connect(config);
    console.log("✅ Conexión exitosa a la base de datos (SQL Auth).");
    const result = await sql.query`SELECT GETDATE() AS fecha_actual`;
    console.log("📅 Fecha actual desde SQL Server:", result.recordset[0].fecha_actual);
    await sql.close();
  } catch (err) {
    console.error("❌ Error al conectar:");
    console.error(err);
  }
}

testConnection();
