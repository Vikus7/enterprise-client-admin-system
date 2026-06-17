import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { customerService } from '../services/customerService.ts'
import { getApiErrorMessage, getApiErrorResponse } from '../services/apiErrors.ts'
import type { CustomerFormValues, CustomerStatus } from '../types/customer.ts'

const initialValues: CustomerFormValues = {
  jdeCode: '',
  taxId: '',
  businessName: '',
  commercialName: '',
  email: '',
  phone: '',
  status: 'ACTIVE',
  creditLimit: '',
}

type FormFieldErrors = Partial<Record<keyof CustomerFormValues, string>>

export function CustomerFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const navigate = useNavigate()
  const params = useParams()
  const customerId = Number(params.id)
  const isEditing = mode === 'edit'
  const [values, setValues] = useState<CustomerFormValues>(initialValues)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({})

  const title = useMemo(() => (isEditing ? 'Editar cliente' : 'Crear cliente'), [isEditing])

  useEffect(() => {
    if (!isEditing || Number.isNaN(customerId)) {
      setLoading(false)
      return
    }

    const bootstrap = async () => {
      try {
        const customer = await customerService.getById(customerId)
        setValues({
          jdeCode: customer.jdeCode,
          taxId: customer.taxId,
          businessName: customer.businessName,
          commercialName: customer.commercialName ?? '',
          email: customer.email ?? '',
          phone: customer.phone ?? '',
          status: customer.status,
          creditLimit: customer.creditLimit != null ? String(customer.creditLimit) : '',
        })
      } catch {
        setError('No fue posible cargar el cliente solicitado.')
      } finally {
        setLoading(false)
      }
    }

    void bootstrap()
  }, [customerId, isEditing])

  const updateField = <Key extends keyof CustomerFormValues>(field: Key, value: CustomerFormValues[Key]) => {
    setValues((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
  }

  const applyServerFieldErrors = (errors: Record<string, string>) => {
    const nextErrors: FormFieldErrors = {}

    Object.entries(errors).forEach(([key, value]) => {
      if (key in values) {
        nextErrors[key as keyof CustomerFormValues] = value
      }
    })

    setFieldErrors(nextErrors)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setFieldErrors({})

    try {
      if (isEditing) {
        await customerService.update(customerId, values)
      } else {
        await customerService.create(values)
      }

      navigate('/clients')
    } catch (exception) {
      const response = getApiErrorResponse(exception)

      if (response?.fieldErrors) {
        applyServerFieldErrors(response.fieldErrors)
        setError(response.message ?? 'La validacion del formulario fallo')
      } else {
        setError(getApiErrorMessage(exception, 'No fue posible guardar el cliente.'))
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Paper sx={{ p: 4, border: '1px solid rgba(16, 33, 45, 0.08)' }}>
        <Typography>Cargando formulario...</Typography>
      </Paper>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h3" component="h1">
          {title}
        </Typography>
        <Typography color="text.secondary">
          Completa los campos para mantener consistencia con las reglas de validacion del backend.
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Card elevation={0} sx={{ border: '1px solid rgba(16, 33, 45, 0.08)' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField
                label="Codigo JDE"
                value={values.jdeCode}
                onChange={(event) => updateField('jdeCode', event.target.value)}
                fullWidth
                required
                error={Boolean(fieldErrors.jdeCode)}
                helperText={fieldErrors.jdeCode}
              />
              <TextField
                label="Identificador tributario"
                value={values.taxId}
                onChange={(event) => updateField('taxId', event.target.value)}
                fullWidth
                required
                error={Boolean(fieldErrors.taxId)}
                helperText={fieldErrors.taxId}
              />
            </Box>

            <TextField
              label="Razon social"
              value={values.businessName}
              onChange={(event) => updateField('businessName', event.target.value)}
              fullWidth
              required
              error={Boolean(fieldErrors.businessName)}
              helperText={fieldErrors.businessName}
            />

            <TextField
              label="Nombre comercial"
              value={values.commercialName}
              onChange={(event) => updateField('commercialName', event.target.value)}
              fullWidth
              error={Boolean(fieldErrors.commercialName)}
              helperText={fieldErrors.commercialName}
            />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField
                label="Correo electronico"
                type="email"
                value={values.email}
                onChange={(event) => updateField('email', event.target.value)}
                fullWidth
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
              />
              <TextField
                label="Telefono"
                value={values.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                fullWidth
                error={Boolean(fieldErrors.phone)}
                helperText={fieldErrors.phone}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="customer-status-label">Estado</InputLabel>
                <Select
                  labelId="customer-status-label"
                  label="Estado"
                  value={values.status}
                  onChange={(event) => updateField('status', event.target.value as CustomerStatus)}
                >
                  <MenuItem value="ACTIVE">Activo</MenuItem>
                  <MenuItem value="INACTIVE">Inactivo</MenuItem>
                  <MenuItem value="BLOCKED">Bloqueado</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Limite de credito"
                type="number"
                value={values.creditLimit}
                onChange={(event) => updateField('creditLimit', event.target.value)}
                fullWidth
                slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
                error={Boolean(fieldErrors.creditLimit)}
                helperText={fieldErrors.creditLimit}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Button variant="outlined" onClick={() => navigate('/clients')}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cliente'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}