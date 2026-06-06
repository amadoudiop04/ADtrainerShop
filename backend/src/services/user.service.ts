import User, { UserType } from '../models/user.model';

export const getAllUsers = async (): Promise<UserType[]> => {
    try {
        return await User.findAll();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('An error occurred while fetching users');
    }
};

export const getUserById = async (id: number | string): Promise<UserType> => {
    try {
        const user = await User.findByPk(id);
        if (user) {
            return user;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        throw new Error('An error occurred while fetching the user');
    }
};

export const createUser = async (
    firstName: string,
    lastName: string,
    email: string,
    phone?: string
): Promise<UserType> => {
    try {
        return await User.create({ firstName, lastName, email, phone });
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('An error occurred while creating the user');
    }
};

export const updateUser = async (
    id: number | string,
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string
): Promise<UserType> => {
    try {
        const user = await User.findByPk(id);
        if (user) {
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.email = email || user.email;
            user.phone = phone || user.phone;
            const saved = await User.save(user);
            return saved;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {

        console.error(`Error updating user with id ${id}:`, error);
        throw new Error('An error occurred while updating the user');
    }

};

export const deleteUser = async (id: number | string): Promise<void> => {
    try {
        const user = await User.findByPk(id);
        if (user) {
            await User.destroy(user);
            return;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw new Error('An error occurred while deleting the user');
    }
};
