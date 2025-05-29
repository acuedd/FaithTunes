import axios from 'axios';
import type { User } from '../types';

const API = import.meta.env.VITE_API_URL;

export const getUsers = async (config = {}): Promise<User[]> => {
  const res = await axios.get(`${API}/users`, config);
  return res.data;
};

export const createUser = async (data: Partial<User>, config = {}) => {
  const res = await axios.post(`${API}/users`, data, config);
  return res.data;
};

export const updateUser = async (id: number, data: Partial<User>, config = {}) => {
  const res = await axios.patch(`${API}/users/${id}`, data, config);
  return res.data;
};

export const deleteUser = async (id: number, config = {}) => {
  await axios.delete(`${API}/users/${id}`, config);
};