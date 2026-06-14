import { query } from '../../db';

const SettingsModel = {
  async get(key: string): Promise<string | null> {
    const result = await query(
      `SELECT value FROM site_settings WHERE key = $1`,
      [key]
    );
    return result.rowCount === 0 ? null : result.rows[0].value;
  },

  async set(key: string, value: string): Promise<void> {
    await query(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
      [key, value]
    );
  },
};

export default SettingsModel;
