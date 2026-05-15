const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '',
  database: 'taskflow',
  connectionTimeoutMillis: 5000,
});
pool.query('SELECT 1', (err, res) => {
  if (err) {
    console.error('ERROR: ' + err.message);
    process.exit(1);
  }
  console.log('Windows Node.js connected to PostgreSQL!');
  pool.end();
  process.exit(0);
});
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 5000);
