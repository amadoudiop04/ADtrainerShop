import Collection, { CollectionType } from '../models/collection.model';

export const getAllCollections = async (): Promise<CollectionType[]> => {
  try {
    return await Collection.findAll();
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw new Error('An error occurred while fetching collections');
  }
};

export const getCollectionById = async (id: string): Promise<CollectionType> => {
  try {
    const collection = await Collection.findByPk(id);
    if (!collection) {
      throw new Error('Collection not found');
    }
    return collection;
  } catch (error) {
    console.error(`Error fetching collection with id ${id}:`, error);
    throw new Error('An error occurred while fetching the collection');
  }
};

export const createCollection = async (
  name: string,
  slug: string,
  description?: string,
  is_active?: boolean
): Promise<CollectionType> => {
  try {
    return await Collection.create({ name, slug, description, is_active });
  } catch (error) {
    console.error('Error creating collection:', error);
    throw new Error('An error occurred while creating the collection');
  }
};

export const updateCollection = async (
  id: string,
  name?: string,
  slug?: string,
  description?: string,
  is_active?: boolean
): Promise<CollectionType> => {
  try {
    const collection = await Collection.findByPk(id);
    if (!collection) {
      throw new Error('Collection not found');
    }
    collection.name = name ?? collection.name;
    collection.slug = slug ?? collection.slug;
    collection.description = description ?? collection.description;
    collection.is_active = is_active ?? collection.is_active;
    return await Collection.save(collection);
  } catch (error) {
    console.error(`Error updating collection with id ${id}:`, error);
    throw new Error('An error occurred while updating the collection');
  }
};

export const deleteCollection = async (id: string): Promise<void> => {
  try {
    await Collection.destroy(id);
  } catch (error) {
    console.error(`Error deleting collection with id ${id}:`, error);
    throw new Error('An error occurred while deleting the collection');
  }
};