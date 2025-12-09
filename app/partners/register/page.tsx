'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/partners/api'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    phone: '',
    referrerCode: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 유효성 검사
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다')
      return
    }

    if (formData.loginId.length < 4) {
      setError('아이디는 4자 이상이어야 합니다')
      return
    }

    // 전화번호 유효성 검사
    const phoneRegex = /^01[0-9]{8,9}$/
    if (!phoneRegex.test(formData.phone.replace(/-/g, ''))) {
      setError('올바른 휴대폰 번호를 입력해주세요')
      return
    }

    setIsLoading(true)

    try {
      await api.post('/auth/register', {
        loginId: formData.loginId,
        password: formData.password,
        nickname: formData.nickname,
        phone: formData.phone.replace(/-/g, ''),
        referrerCode: formData.referrerCode || undefined,
      })

      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      router.push('/partners/login')
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-[400px]">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/partners/login"
            className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-title text-text-primary">파트너 가입하기</h1>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-small text-text-secondary mb-2">
              아이디
            </label>
            <input
              type="text"
              name="loginId"
              placeholder="4자 이상 영문, 숫자"
              value={formData.loginId}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-bg-card rounded-input text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary transition-all"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-small text-text-secondary mb-2">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              placeholder="6자 이상"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-bg-card rounded-input text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary transition-all"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-small text-text-secondary mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 재입력"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-bg-card rounded-input text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary transition-all"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-small text-text-secondary mb-2">
              닉네임
            </label>
            <input
              type="text"
              name="nickname"
              placeholder="표시될 이름"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-bg-card rounded-input text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary transition-all"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-small text-text-secondary mb-2">
              휴대폰 번호
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="'-' 없이 숫자만 입력"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-bg-card rounded-input text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary transition-all"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-small text-text-secondary mb-2">
              추천인 코드 <span className="text-text-tertiary">(선택)</span>
            </label>
            <input
              type="text"
              name="referrerCode"
              placeholder="추천인의 파트너 코드"
              value={formData.referrerCode}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-bg-card rounded-input text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary transition-all"
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-error text-caption text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-action-primary hover:bg-action-primary-hover disabled:bg-text-tertiary text-white rounded-button text-body font-semibold transition-all flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-body text-text-secondary">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/partners/login"
              className="text-action-primary font-medium hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
