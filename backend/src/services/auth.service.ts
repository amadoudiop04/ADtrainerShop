import bcrypt from 'bcryptjs';
import { query } from '../../db';
import User, { UserType } from '../models/user.model';

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone?: string
): Promise<UserType> => {
  const existing = await query('SELECT user_id FROM users WHERE email = $1', [email]);
  if (existing.rowCount && existing.rowCount > 0) {
    throw new Error('EMAIL_EXISTS');
  }
  const password_hash = await bcrypt.hash(password, 10);
  return await User.create({ firstName, lastName, email, password_hash, phone, role: 'customer', is_active: true });
};

export const loginUser = async (email: string, password: string): Promise<UserType> => {
  const result = await query(
    `SELECT user_id, email, password_hash, first_name, last_name, phone, role, is_active, created_at, updated_at
     FROM users WHERE email = $1`,
    [email]
  );
  if (!result.rowCount || result.rowCount === 0) {
    throw new Error('INVALID_CREDENTIALS');
  }
  const row = result.rows[0];
  const valid = await bcrypt.compare(password, row.password_hash ?? '');
  if (!valid) throw new Error('INVALID_CREDENTIALS');
  return {
    id: row.user_id,
    email: row.email,
    password_hash: row.password_hash,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone ?? undefined,
    role: row.role,
    is_active: row.is_active,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  };
};
