import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material'
import { useAuth } from '../../context/AuthContext.tsx'

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
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              PA-CO Clients
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Minimal admin console for B4B/JDE customers
            </Typography>
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
              List
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
              Create
            </Button>
            <Button
              variant="outlined"
              onClick={handleLogout}
              disabled={busy}
              sx={{ borderColor: 'rgba(16, 33, 45, 0.18)' }}
            >
              Logout
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