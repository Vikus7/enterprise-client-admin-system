import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material'
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
      setError(getApiErrorMessage(error, 'No fue posible iniciar sesión. Verifica tus credenciales.'))
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
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Box sx={{ flex: 1, maxWidth: 560 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>
            PA-CO COMERCIAL E INDUSTRIAL
          </Typography>
          <Typography variant="h2" component="h1">
            A minimal workspace for customer operations.
          </Typography>
          <Typography color="text.secondary">
            Sign in to manage business customers, edit records, and keep the audit trail in sync with the backend.
          </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                JWT
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Stateless access
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                CRUD
              </Typography>
              <Typography variant="body2" color="text.secondary">
                List, create and edit
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Audit
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Operations logged
              </Typography>
            </Box>
              </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1, width: '100%', maxWidth: 560 }}>
        <Card
          elevation={0}
          sx={{
            border: '1px solid rgba(16, 33, 45, 0.08)',
            boxShadow: '0 24px 80px rgba(16, 33, 45, 0.12)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} onSubmit={handleSubmit}>
              <Box>
                <Typography variant="h4" component="h2" gutterBottom>
                  Sign in
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use the credentials seeded by the backend.
                </Typography>
              </Box>

              {error ? <Alert severity="error">{error}</Alert> : null}

              <TextField
                label="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                fullWidth
                autoComplete="username"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                autoComplete="current-password"
                required
              />

              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? 'Signing in...' : 'Enter dashboard'}
              </Button>
                </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}