'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/lib/partners/store'
import { Loader2 } from 'lucide-react'
import ThemeToggle from '@/components/shared/ThemeToggle'

const LOGO_URL = 'https://hvwgs4k77hcs8ntu.public.blob.vercel-storage.com/blooom_logo'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(loginId, password)
      router.push('/partners/inquiries')
    } catch (err: any) {
      setError(err.response?.data?.error || '로그인에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6">
      {/* 테마 토글 버튼 */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[400px]">
        {/* 로고/타이틀 */}
        <div className="text-center mb-10">
          <Image src={LOGO_URL} alt="Blooom" width={140} height={40} className="h-10 w-auto mx-auto mb-4 dark:brightness-0 dark:invert" />
          <p className="text-body text-text-secondary">파트너스 로그인</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="아이디"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-4 py-4 bg-bg-card rounded-input text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary outline-none transition-all"
              disabled={isLoading}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 bg-bg-card rounded-input text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary outline-none transition-all"
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-error text-caption text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !loginId || !password}
            className="w-full py-4 bg-action-primary hover:bg-action-primary-hover disabled:bg-text-tertiary text-white rounded-button text-body font-semibold transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div className="mt-6 text-center">
          <p className="text-body text-text-secondary">
            계정이 없으신가요?{' '}
            <Link
              href="/partners/register"
              className="text-action-primary font-medium hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>

        {/* 관리자 로그인 링크 */}
        <div className="mt-8 pt-6 border-t border-border">
          <Link
            href="/admin/login"
            className="block w-full py-3 text-center text-small text-text-tertiary hover:text-text-secondary transition-colors"
          >
            관리자로 로그인
          </Link>
        </div>
      </div>
    </div>
  )
}
