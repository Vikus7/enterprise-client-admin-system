export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED'

export interface CustomerResponse {
  id: number
  jdeCode: string
  taxId: string
  businessName: string
  commercialName?: string | null
  email?: string | null
  phone?: string | null
  status: CustomerStatus
  creditLimit?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface CustomerFormValues {
  jdeCode: string
  taxId: string
  businessName: string
  commercialName: string
  email: string
  phone: string
  status: CustomerStatus
  creditLimit: string
}