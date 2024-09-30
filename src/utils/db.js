import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

function createDatabase () {
  let pool = null;

  const connect = () => {
    if ( pool ) return pool;

    pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD    
    });

    return pool;
  }

  const getPool = () => {
    return pool;
  }

  return { connect, getPool };
}

export default createDatabase();
