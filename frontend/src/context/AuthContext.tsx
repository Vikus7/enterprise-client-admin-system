import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authTokenKey } from '../services/api.ts'
import { authService } from '../services/authService.ts'

interface AuthContextValue {
  isAuthenticated: boolean
  initialized: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    setToken(localStorage.getItem(authTokenKey))
    setInitialized(true)
  }, [])

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password })
    localStorage.setItem(authTokenKey, response.token)
    setToken(response.token)
  }

  const logout = () => {
    localStorage.removeItem(authTokenKey)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        initialized,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}