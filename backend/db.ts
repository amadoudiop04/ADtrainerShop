import { Pool, PoolClient, QueryResult } from 'pg';

let pool: Pool | null = null;

export const connect = async (uri: string): Promise<void> => {
  if (!uri) {
    throw new Error('DB_POSTGRES_URI is not defined in environment variables');
  }

  console.log(`Connecting to database at ${uri}`);
  pool = new Pool({ connectionString: uri });

  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connection established');
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
    throw error;
  }
};

export const query = async (text: string, params: any[] = []): Promise<QueryResult> => {
  if (!pool) {
    throw new Error('Database pool is not initialized. Call connect() first.');
  }

  return pool.query(text, params);
};

export const getClient = async (): Promise<PoolClient> => {
  if (!pool) {
    throw new Error('Database pool is not initialized. Call connect() first.');
  }

  return pool.connect();
};

