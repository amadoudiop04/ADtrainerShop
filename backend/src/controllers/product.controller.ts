import type { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/product.service';

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

  try {
    const product = await createProduct(
      name,
      slug,
      Number(price),
      collection_id,
      description,
      stock !== undefined ? Number(stock) : undefined,
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