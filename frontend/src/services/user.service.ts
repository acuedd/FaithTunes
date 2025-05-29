import api from '../api/axiosInstance';
import type { User } from '../types';

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get('/users');
  return res.data;
};

export const createUser = async (data: Partial<User>) => {
  const res = await api.post('/users', data);
  return res.data;
};

export const updateUser = async (id: number, data: Partial<User>) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}`);
};