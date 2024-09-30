import fs from 'fs';
import { from as copyFrom } from 'pg-copy-streams';
import { pipeline } from 'stream/promises';
import db from '../../src/utils/db.js';

const COPY_QUERY = `
  COPY transactions (
    type,
    buy_amount,
    buy_currency,
    sell_amount,
    sell_currency,
    fee_amount,
    fee_currency,
    exchange,
    transaction_group,
    comment,
    date,
    transaction_id
  )
  FROM STDIN WITH (FORMAT csv, HEADER true)
`;


export async function importCSV ({ filePath }) {
  const pool = db.connect();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const fileStream = fs.createReadStream(filePath);  
    const writeStream = client.query(copyFrom(COPY_QUERY));

    await pipeline(fileStream, writeStream);

    await client.query('COMMIT');
    console.log('CSV successfully imported into the database');
    
  } catch (err) { 
    console.err('Failed to import CSV', err); 
    await client.query('ROLLBACK');
    throw err;

  } finally {
    client.release();
  };
}
