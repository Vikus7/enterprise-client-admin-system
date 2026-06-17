import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import PersonIcon from '@mui/icons-material/Person'
import { useAuth } from '../context/AuthContext.tsx'
import { getApiErrorMessage } from '../services/apiErrors.ts'

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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ width: '100%', textAlign: 'center', pt: { xs: 4, md: 8 } }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Bienvenido
        </Typography>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
          Administracion de Clientes Empresariales
        </Typography>
        <Box
          sx={{
            width: 84,
            height: 84,
            margin: '18px auto 0',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'rgba(15, 118, 110, 0.12)',
            border: '2px solid rgba(15, 118, 110, 0.2)',
          }}
        >
          <DashboardCustomizeIcon sx={{ color: 'primary.main', fontSize: 46 }} />
        </Box>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 420, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card
          elevation={0}
          sx={{
            width: '100%',
            border: '1px solid rgba(16, 33, 45, 0.08)',
            boxShadow: '0 24px 80px rgba(16, 33, 45, 0.12)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack component="form" spacing={3} onSubmit={handleSubmit}>
              <Box>
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                  Iniciar sesion
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
                slotProps={{ input: { startAdornment: <PersonIcon sx={{ mr: 1, opacity: 0.5 }} fontSize="small" /> } }}
              />
              <TextField
                label="Contrasena"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                autoComplete="current-password"
                required
                slotProps={{ input: { startAdornment: <LockOutlinedIcon sx={{ mr: 1, opacity: 0.5 }} fontSize="small" /> } }}
              />

              <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth startIcon={<LoginOutlinedIcon />}>
                {loading ? 'Ingresando...' : 'Entrar'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ width: '100%', textAlign: 'center', pb: 4 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Administra tus clientes empresariales de forma segura y eficiente.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="text.disabled">
          by Victor Rodriguez
        </Typography>
      </Box>
    </Box>
  )
}
