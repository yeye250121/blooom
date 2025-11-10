import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/app/partners/lib/api'

interface User {
  id: number
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
        // 데모 계정 처리 (임시)
        if (loginId === 'demo' && password === 'demo123') {
          const demoUser = {
            id: 1,
            loginId: 'demo',
            nickname: '데모 파트너',
            uniqueCode: 'S00001',
            level: 1,
          }
          set({ token: 'demo-token', user: demoUser })
          return
        }

        // 실제 API 호출
        try {
          const response = await api.post('/auth/login', { loginId, password })
          const { access_token, marketer } = response.data
          set({ token: access_token, user: marketer })
        } catch (error: any) {
          throw new Error(error.response?.data?.message || '로그인 실패')
        }
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
