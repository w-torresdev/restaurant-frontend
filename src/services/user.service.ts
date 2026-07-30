import { api } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>("/users/me");
    return response.data;
  },
  
  getSummary: async (period?: string) => {
    const response = await api.get(`/metrics/summary${period ? `?period=${period}` : ''}`);
    return response.data;
  }
};
