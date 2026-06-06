import { query } from '../../db';

export interface Product {
  id: string;
  collection_id?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  image_url?: string;
  status: 'available' | 'out_of_stock' | 'archived';
  created_at: Date;
  updated_at: Date;
}

const mapProductRow = (row: any): Product => ({
  id: row.product_id,
  collection_id: row.collection_id ?? undefined,
  name: row.name,
  slug: row.slug,
  description: row.description ?? undefined,
  price: Number(row.price),
  stock: row.stock,
  sku: row.sku ?? undefined,
  image_url: row.image_url ?? undefined,
  status: row.status,
  created_at: new Date(row.created_at),
  updated_at: new Date(row.updated_at),
});

const ProductModel = {
  async findAll(): Promise<Product[]> {
    const result = await query(
      `SELECT product_id, collection_id, name, slug, description, price, stock, sku, image_url, status, created_at, updated_at
       FROM products
       ORDER BY created_at DESC`
    );
    return result.rows.map(mapProductRow);
  },

  async findByPk(id: string): Promise<Product | null> {
    const result = await query(
      `SELECT product_id, collection_id, name, slug, description, price, stock, sku, image_url, status, created_at, updated_at
       FROM products
       WHERE product_id::text = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      return null;
    }
    return mapProductRow(result.rows[0]);
  },

  async create(data: Partial<Product>): Promise<Product> {
    const result = await query(
      `INSERT INTO products (collection_id, name, slug, description, price, stock, sku, image_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING product_id, collection_id, name, slug, description, price, stock, sku, image_url, status, created_at, updated_at`,
      [
        data.collection_id ?? null,
        data.name ?? '',
        data.slug ?? '',
        data.description ?? null,
        data.price ?? 0,
        data.stock ?? 0,
        data.sku ?? null,
        data.image_url ?? null,
        data.status ?? 'available',
      ]
    );
    return mapProductRow(result.rows[0]);
  },

  async save(product: Product): Promise<Product> {
    const result = await query(
      `UPDATE products
       SET collection_id = $1,
           name = $2,
           slug = $3,
           description = $4,
           price = $5,
           stock = $6,
           sku = $7,
           image_url = $8,
           status = $9,
           updated_at = NOW()
       WHERE product_id = $10
       RETURNING product_id, collection_id, name, slug, description, price, stock, sku, image_url, status, created_at, updated_at`,
      [
        product.collection_id ?? null,
        product.name,
        product.slug,
        product.description ?? null,
        product.price,
        product.stock,
        product.sku ?? null,
        product.image_url ?? null,
        product.status,
        product.id,
      ]
    );
    if (result.rowCount === 0) {
      throw new Error('Product not found');
    }
    return mapProductRow(result.rows[0]);
  },

  async destroy(id: string): Promise<void> {
    const result = await query(`DELETE FROM products WHERE product_id = $1`, [id]);
    if (result.rowCount === 0) {
      throw new Error('Product not found');
    }
  },
};

export default ProductModel;
export { Product as ProductType };