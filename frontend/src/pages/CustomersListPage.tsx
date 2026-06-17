import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteIcon from '@mui/icons-material/Delete'
import { customerService } from '../services/customerService.ts'
import type { CustomerResponse } from '../types/customer.ts'

const currencyFormatter = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

function statusColor(status: CustomerResponse['status']) {
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

export function CustomersListPage() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<CustomerResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      `Disable ${customer.businessName}? This keeps the audit trail intact.`,
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
            Customers
          </Typography>
          <Typography color="text.secondary">
            Structured view of the B4B/JDE client registry.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button startIcon={<RefreshIcon />} onClick={handleRefresh} variant="outlined" disabled={refreshing}>
            Refresh
          </Button>
          <Button startIcon={<AddIcon />} onClick={() => navigate('/clients/new')} variant="contained">
            New customer
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Paper sx={{ p: 2.5, flex: 1, border: '1px solid rgba(16, 33, 45, 0.08)' }}>
          <Typography variant="overline" color="text.secondary">
            Total customers
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {customers.length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2.5, flex: 1, border: '1px solid rgba(16, 33, 45, 0.08)' }}>
          <Typography variant="overline" color="text.secondary">
            Active records
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {activeCount}
          </Typography>
        </Paper>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper elevation={0} sx={{ overflow: 'hidden', border: '1px solid rgba(16, 33, 45, 0.08)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : customers.length === 0 ? (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              No customers yet
            </Typography>
            <Typography color="text.secondary">
              Create the first customer to populate the registry.
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>JDE</TableCell>
                <TableCell>Business name</TableCell>
                <TableCell>Tax ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Credit limit</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.jdeCode}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                      <Typography sx={{ fontWeight: 600 }}>{customer.businessName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.commercialName || 'No commercial name'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.taxId}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status}
                      color={statusColor(customer.status) as never}
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
                      <IconButton onClick={() => navigate(`/clients/${customer.id}/edit`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(customer)}>
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
