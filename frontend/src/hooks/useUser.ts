import { useCallback } from 'react';
import type { User } from '../types';
import {
  getUsers as apiGetUsers,
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from '../services/user.service';

export function useUser() {
  const getUsers = useCallback(async (): Promise<User[]> => {
    return await apiGetUsers();
  }, []);

  const createUser = useCallback(async (data: Partial<User>): Promise<User> => {
    return await apiCreateUser(data);
  }, []);

  const updateUser = useCallback(async (id: number, data: Partial<User>): Promise<User> => {
    return await apiUpdateUser(id, data);
  }, []);

  const deleteUser = useCallback(async (id: number): Promise<void> => {
    await apiDeleteUser(id);
  }, []);

  return {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}