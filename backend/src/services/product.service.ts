import Product, { ProductType } from '../models/product.model';

export const getAllProducts = async (): Promise<ProductType[]> => {
  try {
    return await Product.findAll();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('An error occurred while fetching products');
  }
};

export const getProductById = async (id: string): Promise<ProductType> => {
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw new Error('An error occurred while fetching the product');
  }
};

export const createProduct = async (
  name: string,
  slug: string,
  price: number,
  collection_id?: string,
  description?: string,
  stock?: number,
  sku?: string,
  image_url?: string,
  status?: 'available' | 'out_of_stock' | 'archived'
): Promise<ProductType> => {
  try {
    return await Product.create({
      name,
      slug,
      price,
      collection_id,
      description,
      stock,
      sku,
      image_url,
      status,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('An error occurred while creating the product');
  }
};

export const updateProduct = async (
  id: string,
  fields: Partial<Omit<ProductType, 'id' | 'created_at' | 'updated_at'>>
): Promise<ProductType> => {
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    product.name = fields.name ?? product.name;
    product.slug = fields.slug ?? product.slug;
    product.description = fields.description ?? product.description;
    product.price = fields.price ?? product.price;
    product.stock = fields.stock ?? product.stock;
    product.sku = fields.sku ?? product.sku;
    product.image_url = fields.image_url ?? product.image_url;
    product.status = fields.status ?? product.status;
    product.collection_id = fields.collection_id ?? product.collection_id;
    return await Product.save(product);
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw new Error('An error occurred while updating the product');
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await Product.destroy(id);
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw new Error('An error occurred while deleting the product');
  }
};