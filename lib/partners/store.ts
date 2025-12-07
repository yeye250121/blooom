import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/partners/api'

interface User {
  id: string
  loginId: string
  nickname: string
  uniqueCode: string
  level: number
  phone?: string | null
  bankName?: string | null
  accountNumber?: string | null
  accountHolder?: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (token: string, user: User) => void
  logout: () => void
  login: (loginId: string, password: string, rememberMe?: boolean) => Promise<void>
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (token, user) => set({ token, user }),
      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (error) {
          console.error('Logout error:', error)
        }
        set({ token: null, user: null })
      },
      login: async (loginId, password, rememberMe = false) => {
        const response = await api.post('/auth/login', { loginId, password, rememberMe })
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
