import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  FormControl,
  Chip,
  CircularProgress,
  IconButton,
  InputLabel,
  Paper,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteIcon from '@mui/icons-material/Delete'
import { customerService } from '../services/customerService.ts'
import type { CustomerResponse } from '../types/customer.ts'

type BadgeColor = 'success' | 'warning' | 'default'

const currencyFormatter = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

function statusColor(status: CustomerResponse['status']): BadgeColor {
  if (status === 'ACTIVE') {
    return 'success'
  }

  if (status === 'BLOCKED') {
    return 'warning'
  }

  return 'default'
}

function formatDate(value?: string | null) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function HeaderCell({ title, dbName }: { title: string; dbName: string }) {
  return (
    <TableCell>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {dbName}
        </Typography>
      </Box>
    </TableCell>
  )
}

export function CustomersListPage() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<CustomerResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | CustomerResponse['status']>('ALL')

  const loadCustomers = async () => {
    setError(null)

    try {
      const data = await customerService.list()
      setCustomers(data)
    } catch {
      setError('No fue posible cargar los clientes.')
    }
  }

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true)
      await loadCustomers()
      setLoading(false)
    }

    void bootstrap()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadCustomers()
    setRefreshing(false)
  }

  const handleDelete = async (customer: CustomerResponse) => {
    const confirmed = window.confirm(
      `Eliminar de forma logica a ${customer.businessName}? El registro quedara disponible para auditoria.`,
    )

    if (!confirmed) {
      return
    }

    try {
      await customerService.remove(customer.id)
      await loadCustomers()
    } catch {
      setError('No fue posible desactivar el cliente.')
    }
  }

  const activeCount = customers.filter((customer) => customer.status === 'ACTIVE').length
  const filteredCustomers = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    return customers.filter((customer) => {
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        [customer.jdeCode, customer.taxId, customer.businessName, customer.commercialName ?? '']
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearchTerm)

      const matchesStatus = statusFilter === 'ALL' || customer.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [customers, searchTerm, statusFilter])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h3" component="h1">
            Clientes empresariales
          </Typography>
          <Typography color="text.secondary">
            Vista estructurada del registro B4B/JDE.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button startIcon={<RefreshIcon />} onClick={handleRefresh} variant="outlined" disabled={refreshing}>
            Actualizar
          </Button>
          <Button startIcon={<AddIcon />} onClick={() => navigate('/clients/new')} variant="contained">
            Nuevo cliente
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Paper sx={{ p: 2.5, flex: 1, border: '1px solid rgba(16, 33, 45, 0.08)' }}>
          <Typography variant="overline" color="text.secondary">
            Clientes totales
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {customers.length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2.5, flex: 1, border: '1px solid rgba(16, 33, 45, 0.08)' }}>
          <Typography variant="overline" color="text.secondary">
            Registros activos
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {activeCount}
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ p: 2.5, border: '1px solid rgba(16, 33, 45, 0.08)' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <TextField
            label="Buscar clientes"
            placeholder="JDE, identificador, razon social..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            fullWidth
          />

          <FormControl sx={{ minWidth: { xs: '100%', md: 220 } }}>
            <InputLabel id="status-filter-label">Estado</InputLabel>
            <Select
              labelId="status-filter-label"
              label="Estado"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'ALL' | CustomerResponse['status'])}
            >
              <MenuItem value="ALL">Todos</MenuItem>
              <MenuItem value="ACTIVE">Activo</MenuItem>
              <MenuItem value="INACTIVE">Inactivo</MenuItem>
              <MenuItem value="BLOCKED">Bloqueado</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('ALL')
            }}
            sx={{ minWidth: { xs: '100%', md: 160 } }}
          >
            Limpiar filtros
          </Button>
        </Box>
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper elevation={0} sx={{ overflow: 'hidden', border: '1px solid rgba(16, 33, 45, 0.08)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : filteredCustomers.length === 0 ? (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              No hay clientes que coincidan
            </Typography>
            <Typography color="text.secondary">
              Ajusta los filtros o crea un nuevo cliente para poblar el registro.
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <HeaderCell title="Codigo JDE" dbName="jde_code" />
                <HeaderCell title="Razon social" dbName="business_name" />
                <HeaderCell title="Identificador tributario" dbName="tax_id" />
                <HeaderCell title="Estado" dbName="status" />
                <HeaderCell title="Limite de credito" dbName="credit_limit" />
                <HeaderCell title="Actualizado" dbName="updated_at" />
                <TableCell align="right">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
                      Acciones
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ui
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.jdeCode}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                      <Typography sx={{ fontWeight: 600 }}>{customer.businessName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.commercialName || 'Sin nombre comercial'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.taxId}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status === 'ACTIVE' ? 'Activo' : customer.status === 'INACTIVE' ? 'Inactivo' : 'Bloqueado'}
                      color={statusColor(customer.status)}
                      size="small"
                      variant={customer.status === 'INACTIVE' ? 'outlined' : 'filled'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {customer.creditLimit != null ? currencyFormatter.format(customer.creditLimit) : '-'}
                  </TableCell>
                  <TableCell>{formatDate(customer.updatedAt || customer.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <IconButton onClick={() => navigate(`/clients/${customer.id}/edit`)} aria-label="Editar cliente">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(customer)} aria-label="Desactivar cliente">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  )
}
