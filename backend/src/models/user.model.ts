import { query } from '../../db';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password_hash: string;
    phone?: string;
    role: 'customer' | 'admin' | 'coach';
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
}

const mapUserRow = (row: any): User => ({
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
});

const UserModel = {
    async findAll(): Promise<User[]> {
        const result = await query(
            `SELECT user_id, email, password_hash, first_name, last_name, phone, role, is_active, created_at, updated_at
             FROM users
             ORDER BY created_at DESC`
        );
        return result.rows.map(mapUserRow);
    },

    async findByPk(id: number | string): Promise<User | null> {
        const result = await query(
            `SELECT user_id, email, password_hash, first_name, last_name, phone, role, is_active, created_at, updated_at
             FROM users
             WHERE user_id::text = $1`,
            [id.toString()]
        );
        if (result.rowCount === 0) {
            return null;
        }
        return mapUserRow(result.rows[0]);
    },

    async create(data: Partial<User>): Promise<User> {
        const result = await query(
            `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING user_id, email, password_hash, first_name, last_name, phone, role, is_active, created_at, updated_at`,
            [
                data.email ?? '',
                data.password_hash ?? '',
                data.firstName ?? '',
                data.lastName ?? '',
                data.phone ?? null,
                data.role ?? 'customer',
                data.is_active !== undefined ? data.is_active : true,
            ]
        );
        return mapUserRow(result.rows[0]);
    },

    async save(user: User): Promise<User> {
        const result = await query(
            `UPDATE users
             SET email = $1,
                 password_hash = $2,
                 first_name = $3,
                 last_name = $4,
                 phone = $5,
                 role = $6,
                 is_active = $7,
                 updated_at = NOW()
             WHERE user_id = $8
             RETURNING user_id, email, password_hash, first_name, last_name, phone, role, is_active, created_at, updated_at`,
            [
                user.email,
                user.password_hash,
                user.firstName,
                user.lastName,
                user.phone ?? null,
                user.role,
                user.is_active,
                user.id,
            ]
        );

        if (result.rowCount === 0) {
            throw new Error('User not found');
        }

        return mapUserRow(result.rows[0]);
    },

    async destroy(user: User): Promise<void> {
        const result = await query(`DELETE FROM users WHERE user_id = $1`, [user.id]);
        if (result.rowCount === 0) {
            throw new Error('User not found');
        }
    },
};

export default UserModel;
export { User as UserType };