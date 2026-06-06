import { query } from '../../db';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const mapCollectionRow = (row: any): Collection => ({
  id: row.collection_id,
  name: row.name,
  slug: row.slug,
  description: row.description ?? undefined,
  is_active: row.is_active,
  created_at: new Date(row.created_at),
  updated_at: new Date(row.updated_at),
});

const CollectionModel = {
  async findAll(): Promise<Collection[]> {
    const result = await query(
      `SELECT collection_id, name, slug, description, is_active, created_at, updated_at
       FROM collections
       ORDER BY created_at DESC`
    );
    return result.rows.map(mapCollectionRow);
  },

  async findByPk(id: string): Promise<Collection | null> {
    const result = await query(
      `SELECT collection_id, name, slug, description, is_active, created_at, updated_at
       FROM collections
       WHERE collection_id::text = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      return null;
    }
    return mapCollectionRow(result.rows[0]);
  },

  async create(data: Partial<Collection>): Promise<Collection> {
    const result = await query(
      `INSERT INTO collections (name, slug, description, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING collection_id, name, slug, description, is_active, created_at, updated_at`,
      [
        data.name ?? '',
        data.slug ?? '',
        data.description ?? null,
        data.is_active !== undefined ? data.is_active : true,
      ]
    );
    return mapCollectionRow(result.rows[0]);
  },

  async save(collection: Collection): Promise<Collection> {
    const result = await query(
      `UPDATE collections
       SET name = $1,
           slug = $2,
           description = $3,
           is_active = $4,
           updated_at = NOW()
       WHERE collection_id = $5
       RETURNING collection_id, name, slug, description, is_active, created_at, updated_at`,
      [
        collection.name,
        collection.slug,
        collection.description ?? null,
        collection.is_active,
        collection.id,
      ]
    );
    if (result.rowCount === 0) {
      throw new Error('Collection not found');
    }
    return mapCollectionRow(result.rows[0]);
  },

  async destroy(id: string): Promise<void> {
    const result = await query(`DELETE FROM collections WHERE collection_id = $1`, [id]);
    if (result.rowCount === 0) {
      throw new Error('Collection not found');
    }
  },
};

export default CollectionModel;
export { Collection as CollectionType };