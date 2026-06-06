import type { Request, Response } from 'express';
import {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../services/collection.service';

export const getCollections = async (req: Request, res: Response) => {
  try {
    const collections = await getAllCollections();
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'An error occurred while fetching collections' });
  }
};

export const getCollection = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const collection = await getCollectionById(id);
    res.json(collection);
  } catch (error) {
    if ((error as Error).message === 'Collection not found') {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }
    console.error(`Error fetching collection ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching the collection' });
  }
};

export const createCollectionHandler = async (req: Request, res: Response) => {
  const { name, slug, description, is_active } = req.body;
  try {
    const collection = await createCollection(name, slug, description, is_active);
    res.status(201).json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'An error occurred while creating the collection' });
  }
};

export const updateCollectionHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug, description, is_active } = req.body;
  try {
    const collection = await updateCollection(id, name, slug, description, is_active);
    res.json(collection);
  } catch (error) {
    if ((error as Error).message === 'Collection not found') {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }
    console.error(`Error updating collection ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while updating the collection' });
  }
};

export const deleteCollectionHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteCollection(id);
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    if ((error as Error).message === 'Collection not found') {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }
    console.error(`Error deleting collection ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the collection' });
  }
};