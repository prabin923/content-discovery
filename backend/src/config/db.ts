import { Pool } from 'pg';
import { getDatabaseUrl } from './env';

const pool = new Pool({
  connectionString: getDatabaseUrl(),
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
