import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { RootState } from '../store';
import type { User } from '../types';
import {
  getUsers as apiGetUsers,
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from '../services/user.service';

export function useUser() {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const getAuthHeaders = useCallback(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const getUsers = useCallback(async (): Promise<User[]> => {
    return await apiGetUsers(getAuthHeaders());
  }, [getAuthHeaders]);

  const createUser = useCallback(async (data: Partial<User>): Promise<User> => {
    return await apiCreateUser(data, getAuthHeaders());
  }, [getAuthHeaders]);

  const updateUser = useCallback(async (id: number, data: Partial<User>): Promise<User> => {
    return await apiUpdateUser(id, data, getAuthHeaders());
  }, [getAuthHeaders]);

  const deleteUser = useCallback(async (id: number): Promise<void> => {
    await apiDeleteUser(id, getAuthHeaders());
  }, [getAuthHeaders]);

  return {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}