import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import PersonIcon from '@mui/icons-material/Person'
import { useAuth } from '../context/AuthContext.tsx'
import { getApiErrorMessage } from '../services/apiErrors.ts'
import viteLogo from '../assets/vite.svg'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login(username, password)
      navigate('/clients', { replace: true })
    } catch (error) {
      setError(getApiErrorMessage(error, 'No fue posible iniciar sesion. Verifica tus credenciales.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: 2, md: 4 },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Box sx={{ maxWidth: 620 }}>
        <Stack spacing={3}>
          <Chip
            icon={<Avatar src={viteLogo} alt="Vite" sx={{ width: 22, height: 22 }} />}
            label="Reto tecnico - PACO"
            color="primary"
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 4,
                display: 'grid',
                placeItems: 'center',
                backgroundColor: 'rgba(15, 118, 110, 0.1)',
                border: '1px solid rgba(15, 118, 110, 0.16)',
              }}
            >
              <BusinessCenterOutlinedIcon color="primary" />
            </Box>
            <Box>
              <Typography variant="h2" component="h1" sx={{ lineHeight: 1.05 }}>
                Administracion de Clientes empresariales
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Acceso minimalista para administrar clientes empresariales con seguridad JWT y auditoria.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Chip icon={<LockOutlinedIcon />} label="Acceso seguro" />
            <Chip icon={<BusinessCenterOutlinedIcon />} label="Clientes empresariales" />
            <Chip icon={<LoginOutlinedIcon />} label="Flujo rapido" />
          </Box>
        </Stack>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 520, justifySelf: 'center' }}>
        <Card
          elevation={0}
          sx={{
            border: '1px solid rgba(16, 33, 45, 0.08)',
            boxShadow: '0 24px 80px rgba(16, 33, 45, 0.12)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack component="form" spacing={3} onSubmit={handleSubmit}>
              <Box>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                  Iniciar sesion
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Usa las credenciales semilla creadas en el backend.
                </Typography>
              </Box>

              {error ? <Alert severity="error">{error}</Alert> : null}

              <TextField
                label="Usuario"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                fullWidth
                autoComplete="username"
                required
                slotProps={{ input: { startAdornment: <PersonIcon fontSize="small" /> } }}
              />
              <TextField
                label="Contrasena"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                autoComplete="current-password"
                required
                slotProps={{ input: { startAdornment: <LockOutlinedIcon fontSize="small" /> } }}
              />

              <Divider />

              <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={<LoginOutlinedIcon />}>
                {loading ? 'Ingresando...' : 'Entrar al sistema'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
