import { query } from '../../db';

export interface CoachingRequest {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  coaching_type: 'one_to_one' | 'e_coaching';
  availability?: string;
  message?: string;
  status: 'new' | 'in_progress' | 'completed' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

const mapCoachingRow = (row: any): CoachingRequest => ({
  id: row.request_id,
  user_id: row.user_id ?? undefined,
  full_name: row.full_name,
  email: row.email,
  phone: row.phone ?? undefined,
  coaching_type: row.coaching_type,
  availability: row.availability ?? undefined,
  message: row.message ?? undefined,
  status: row.status,
  created_at: new Date(row.created_at),
  updated_at: new Date(row.updated_at),
});

const CoachingRequestModel = {
  async findAll(): Promise<CoachingRequest[]> {
    const result = await query(
      `SELECT request_id, user_id, full_name, email, phone, coaching_type, availability, message, status, created_at, updated_at
       FROM coaching_requests
       ORDER BY created_at DESC`
    );
    return result.rows.map(mapCoachingRow);
  },

  async findByPk(id: string): Promise<CoachingRequest | null> {
    const result = await query(
      `SELECT request_id, user_id, full_name, email, phone, coaching_type, availability, message, status, created_at, updated_at
       FROM coaching_requests
       WHERE request_id::text = $1`,
      [id]
    );
    if (result.rowCount === 0) return null;
    return mapCoachingRow(result.rows[0]);
  },

  async create(data: Partial<CoachingRequest>): Promise<CoachingRequest> {
    const result = await query(
      `INSERT INTO coaching_requests (user_id, full_name, email, phone, coaching_type, availability, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING request_id, user_id, full_name, email, phone, coaching_type, availability, message, status, created_at, updated_at`,
      [
        data.user_id ?? null,
        data.full_name ?? '',
        data.email ?? '',
        data.phone ?? null,
        data.coaching_type ?? 'one_to_one',
        data.availability ?? null,
        data.message ?? null,
        data.status ?? 'new',
      ]
    );
    return mapCoachingRow(result.rows[0]);
  },

  async save(request: CoachingRequest): Promise<CoachingRequest> {
    const result = await query(
      `UPDATE coaching_requests
       SET user_id = $1,
           full_name = $2,
           email = $3,
           phone = $4,
           coaching_type = $5,
           availability = $6,
           message = $7,
           status = $8,
           updated_at = NOW()
       WHERE request_id = $9
       RETURNING request_id, user_id, full_name, email, phone, coaching_type, availability, message, status, created_at, updated_at`,
      [
        request.user_id ?? null,
        request.full_name,
        request.email,
        request.phone ?? null,
        request.coaching_type,
        request.availability ?? null,
        request.message ?? null,
        request.status,
        request.id,
      ]
    );
    if (result.rowCount === 0) {
      throw new Error('Coaching request not found');
    }
    return mapCoachingRow(result.rows[0]);
  },

  async destroy(id: string): Promise<void> {
    const result = await query(`DELETE FROM coaching_requests WHERE request_id = $1`, [id]);
    if (result.rowCount === 0) {
      throw new Error('Coaching request not found');
    }
  },
};

export default CoachingRequestModel;
export { CoachingRequest as CoachingRequestType };