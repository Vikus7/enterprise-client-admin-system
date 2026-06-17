import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Container, Toolbar, Typography, Divider } from '@mui/material'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                backgroundColor: 'rgba(15, 118, 110, 0.12)',
                border: '2px solid rgba(15, 118, 110, 0.2)',
              }}
            >
              <DashboardCustomizeIcon sx={{ color: 'primary.main', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1 }}>
                PACO
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                Clients admin
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

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Outlet />
      </Container>

      <Box
        sx={{
          borderTop: '1px solid rgba(16, 33, 45, 0.08)',
          backgroundColor: 'rgba(246, 242, 234, 0.5)',
          py: 3,
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Victor Rodriguez
              </Typography>
              <Typography variant="caption" color="text.secondary">
                victtor.rodriguez01@gmail.com
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                +593 983552078
              </Typography>
              <Typography variant="caption" color="text.secondary">
                🇪🇨 Ecuador
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
