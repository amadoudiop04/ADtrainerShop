import type { Request, Response } from 'express';
import {
    getAllUsers as svcGetAll,
    getUserById as svcGetById,
    createUser as svcCreate,
    updateUser as svcUpdate,
    deleteUser as svcDelete,
} from '../services/user.service';

export const getAllUsers = async (req: Request, res: Response) => {
  console.log('DEBUG: controller.getAllUsers invoked');
  try {
    const users = await svcGetAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await svcGetById(id);
        res.json(user);
    } catch (error) {
        if ((error as Error).message === 'User not found') {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        console.error(`Error fetching user with id ${id}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the user' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { firstName, lastName, email, phone } = req.body;
    try {
        const newUser = await svcCreate(firstName, lastName, email, phone);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { firstName, lastName, email, phone } = req.body;
    try {
        const updated = await svcUpdate(id, firstName, lastName, email, phone);
        res.json(updated);
    } catch (error) {
        if ((error as Error).message === 'User not found') {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        console.error(`Error updating user with id ${id}:`, error);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await svcDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        if ((error as Error).message === 'User not found') {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        console.error(`Error deleting user with id ${id}:`, error);
        res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
};
