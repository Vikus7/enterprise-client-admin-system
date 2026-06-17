import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { useAuth } from '../../context/AuthContext.tsx'
import viteLogo from '../../assets/vite.svg'

export function AppLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  const handleLogout = () => {
    setBusy(true)
    logout()
    navigate('/login', { replace: true })
    setBusy(false)
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(16, 33, 45, 0.08)',
          backgroundColor: 'rgba(246, 242, 234, 0.92)',
          backdropFilter: 'blur(18px)',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box component="img" src={viteLogo} alt="Logo de Vite" sx={{ width: 36, height: 36 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                Administracion de Clientes empresariales
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Reto tecnico - PACO
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              component={NavLink}
              to="/clients"
              sx={{
                color: 'inherit',
                opacity: 0.72,
                textDecoration: 'none',
                '&.active': {
                  opacity: 1,
                },
              }}
            >
              Clientes
            </Button>
            <Button
              component={NavLink}
              to="/clients/new"
              sx={{
                color: 'inherit',
                opacity: 0.72,
                textDecoration: 'none',
                '&.active': {
                  opacity: 1,
                },
              }}
            >
              Nuevo cliente
            </Button>
            <Button
              variant="outlined"
              onClick={handleLogout}
              disabled={busy}
              sx={{ borderColor: 'rgba(16, 33, 45, 0.18)' }}
            >
              Cerrar sesion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
