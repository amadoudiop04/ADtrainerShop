import type { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/product.service';
import { collectionExists } from '../services/collection.service';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    res.json(product);
  } catch (error) {
    if ((error as Error).message === 'Product not found') {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    console.error(`Error fetching product ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching the product' });
  }
};

export const getProductBySlugHandler = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const product = await getProductBySlug(slug);
    res.json(product);
  } catch (error) {
    if ((error as Error).message === 'Product not found') {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    console.error(`Error fetching product slug=${slug}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching the product' });
  }
};

const isUuid = (value: unknown): boolean => {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
};

export const createProductHandler = async (req: Request, res: Response) => {
  const {
    name,
    slug,
    price,
    collection_id,
    description,
    stock,
    sku,
    image_url,
    status,
  } = req.body;

  if (!name || !slug || price === undefined) {
    return res.status(400).json({ error: 'Les champs name, slug et price sont obligatoires' });
  }

  if (collection_id && !isUuid(collection_id)) {
    return res.status(400).json({ error: 'Le champ collection_id doit être un UUID valide' });
  }

  if (status && !['available', 'out_of_stock', 'archived'].includes(status)) {
    return res.status(400).json({ error: 'Le champ status doit être available, out_of_stock ou archived' });
  }

  if (collection_id) {
    const exists = await collectionExists(collection_id);
    if (!exists) {
      return res.status(400).json({ error: 'La collection spécifiée n\'existe pas' });
    }
  }

  const priceNumber = Number(price);
  const stockNumber = stock !== undefined ? Number(stock) : 0;

  if (Number.isNaN(priceNumber) || priceNumber < 0) {
    return res.status(400).json({ error: 'Le champ price doit être un nombre positif' });
  }
  if (stock !== undefined && (Number.isNaN(stockNumber) || stockNumber < 0)) {
    return res.status(400).json({ error: 'Le champ stock doit être un entier positif' });
  }

  try {
    const product = await createProduct(
      name,
      slug,
      priceNumber,
      collection_id,
      description,
      stockNumber,
      sku,
      image_url,
      status
    );
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'An error occurred while creating the product' });
  }
};

export const updateProductHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const fields = req.body;
  if (fields.collection_id) {
    if (!isUuid(fields.collection_id)) {
      return res.status(400).json({ error: 'Le champ collection_id doit être un UUID valide' });
    }
    const exists = await collectionExists(fields.collection_id);
    if (!exists) {
      return res.status(400).json({ error: 'La collection spécifiée n\'existe pas' });
    }
  }

  try {
    const product = await updateProduct(id, fields);
    res.json(product);
  } catch (error) {
    if ((error as Error).message === 'Product not found') {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    console.error(`Error updating product ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while updating the product' });
  }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteProduct(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if ((error as Error).message === 'Product not found') {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    console.error(`Error deleting product ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the product' });
  }
};