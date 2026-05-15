const { Pool } = require('pg');
const p = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/taskflow?schema=public'
});
p.query('SELECT 1', (e, r) => {
  console.log(e ? 'Error: ' + e.message : 'Connection string OK');
  p.end();
});
setTimeout(() => process.exit(0), 3000);
