import { api } from './api.ts'
import type { CustomerFormValues, CustomerResponse } from '../types/customer.ts'

function toPayload(values: CustomerFormValues) {
  return {
    jdeCode: values.jdeCode.trim(),
    taxId: values.taxId.trim(),
    businessName: values.businessName.trim(),
    commercialName: values.commercialName.trim() || null,
    email: values.email.trim() || null,
    phone: values.phone.trim() || null,
    status: values.status,
    creditLimit: values.creditLimit === '' ? null : Number(values.creditLimit),
  }
}

export const customerService = {
  async list() {
    const response = await api.get<CustomerResponse[]>('/api/clients')
    return response.data
  },
  async getById(id: number) {
    const response = await api.get<CustomerResponse>(`/api/clients/${id}`)
    return response.data
  },
  async create(values: CustomerFormValues) {
    const response = await api.post<CustomerResponse>('/api/clients', toPayload(values))
    return response.data
  },
  async update(id: number, values: CustomerFormValues) {
    const response = await api.put<CustomerResponse>(`/api/clients/${id}`, toPayload(values))
    return response.data
  },
  async remove(id: number) {
    const response = await api.delete<CustomerResponse>(`/api/clients/${id}`)
    return response.data
  },
}