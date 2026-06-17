import { LinearProgress } from '@mui/material'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'

export function ProtectedRoute() {
  const { initialized, isAuthenticated } = useAuth()

  if (!initialized) {
    return <LinearProgress color="primary" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}