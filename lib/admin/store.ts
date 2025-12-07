import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/admin/api'

interface Admin {
  id: string
  loginId: string
  nickname: string
  uniqueCode: string
}

interface AuthState {
  admin: Admin | null
  token: string | null
  setToken: (token: string) => void
  setAdmin: (admin: Admin) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      setToken: (token) => set({ token }),
      setAdmin: (admin) => set({ admin }),
      logout: async () => {
        try {
          await api.post('/admin/auth/logout')
        } catch (error) {
          console.error('Logout error:', error)
        }
        set({ token: null, admin: null })
      },
      isAuthenticated: () => {
        const state = get()
        return !!state.token && !!state.admin
      },
    }),
    {
      name: 'admin-auth-storage',
    }
  )
)
