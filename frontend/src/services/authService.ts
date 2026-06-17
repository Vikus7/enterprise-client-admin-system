import { api } from './api.ts'
import type { LoginRequest, LoginResponse } from '../types/auth.ts'

export const authService = {
  async login(payload: LoginRequest) {
    const response = await api.post<LoginResponse>('/api/auth/login', payload)
    return response.data
  },
}