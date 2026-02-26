import { createContext, useContext, useState, useEffect } from 'react'
import { withApiBase } from '../api'

const AuthContext = createContext()

const TOKEN_KEY = 'ventre-token'
const USER_KEY = 'ventre-user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem(USER_KEY)
    return u ? JSON.parse(u) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(!!token)

  useEffect(() => {
    if (token && !user) {
      fetch(withApiBase('/api/auth/me'), {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : null)
        .then(u => {
          setUser(u)
          if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
          else logout()
        })
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const res = await fetch(withApiBase('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erreur de connexion')
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data.user
  }

  const signup = async (email, password, type, nom, localisation) => {
    const res = await fetch(withApiBase('/api/auth/signup'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, type, nom, localisation })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erreur d\'inscription')
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data.user
  }

  const logout = () => {
    if (token) {
      fetch(withApiBase('/api/auth/logout'), { headers: { Authorization: `Bearer ${token}` } }).catch(() => {})
    }
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const updateProfile = async (nom, localisation) => {
    const res = await fetch(withApiBase('/api/auth/profile'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ nom, localisation })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erreur')
    setUser(data)
    localStorage.setItem(USER_KEY, JSON.stringify(data))
    return data
  }

  const authFetch = (url, options = {}) => {
    return fetch(withApiBase(url), {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : undefined
      }
    })
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      updateProfile,
      authFetch,
      isVendeur: user?.type === 'vendeur',
      isClient: user?.type === 'client'
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
