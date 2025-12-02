'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuthStore } from '@/lib/admin/store'
import api from '@/lib/admin/api'
import ThemeToggle from '@/components/shared/ThemeToggle'

const LOGO_URL = 'https://hvwgs4k77hcs8ntu.public.blob.vercel-storage.com/blooom_logo'

export default function AdminLoginPage() {
  const router = useRouter()
  const { setAdmin, setToken } = useAuthStore()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await api.post('/admin/auth/login', { loginId, password })
      const { token, admin } = response.data

      setToken(token)
      setAdmin(admin)
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || '로그인에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      {/* 테마 토글 버튼 */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-bg-card rounded-card p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Image src={LOGO_URL} alt="Blooom" width={140} height={40} className="h-10 w-auto dark:brightness-0 dark:invert" />
              <span className="text-headline text-text-primary">Admin</span>
            </div>
            <p className="text-body text-text-secondary">관리자 로그인</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-small text-text-secondary mb-2">
                아이디
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full px-4 py-3 bg-bg-primary rounded-button text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary outline-none"
                placeholder="관리자 아이디 입력"
                required
              />
            </div>

            <div>
              <label className="block text-small text-text-secondary mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-bg-primary rounded-button text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary outline-none"
                placeholder="비밀번호 입력"
                required
              />
            </div>

            {error && (
              <p className="text-small text-error text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-action-primary text-white rounded-button text-body font-medium hover:bg-action-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
