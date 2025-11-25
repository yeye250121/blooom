import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/partners/api'

interface User {
  id: string
  loginId: string
  nickname: string
  uniqueCode: string
  level: number
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (token: string, user: User) => void
  logout: () => void
  login: (loginId: string, password: string) => Promise<void>
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => {
        set({ token: null, user: null })
      },
      login: async (loginId, password) => {
        const response = await api.post('/auth/login', { loginId, password })
        const { token, user } = response.data
        set({ token, user })
      },
      isAuthenticated: () => {
        const state = get()
        return !!state.token && !!state.user
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
