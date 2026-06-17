import axios from 'axios'
import type { ApiErrorResponse } from '../types/api.ts'

export function getApiErrorResponse(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return null
  }

  const response = error.response?.data as ApiErrorResponse | undefined

  if (!response) {
    return null
  }

  return response
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  const response = getApiErrorResponse(error)

  return response?.message?.trim() || fallback
}