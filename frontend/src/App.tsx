import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { useAuth } from './context/AuthContext.tsx'
import { CustomerFormPage } from './pages/CustomerFormPage.tsx'
import { CustomersListPage } from './pages/CustomersListPage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/clients' : '/login'} replace />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/clients" element={<CustomersListPage />} />
          <Route path="/clients/new" element={<CustomerFormPage mode="create" />} />
          <Route path="/clients/:id/edit" element={<CustomerFormPage mode="edit" />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App