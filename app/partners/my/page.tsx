'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/partners/store'
import api from '@/lib/partners/api'
import BottomNav from '@/components/partners/BottomNav'
import { Copy, Check, ChevronRight, X, Loader2, FileText } from 'lucide-react'

export default function MyPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, setAuth } = useAuthStore()

  const [copied, setCopied] = useState(false)

  // 닉네임 변경 바텀시트
  const [isNicknameSheetOpen, setIsNicknameSheetOpen] = useState(false)
  const [newNickname, setNewNickname] = useState('')
  const [isNicknameLoading, setIsNicknameLoading] = useState(false)

  // 비밀번호 변경 바텀시트
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/partners/login')
    }
  }, [])

  const handleCopyLink = async () => {
    if (!user) return
    const link = `blooom.kr/${user.uniqueCode}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => {
    logout()
    router.push('/partners/login')
  }

  const handleNicknameChange = async () => {
    if (!newNickname.trim()) return

    setIsNicknameLoading(true)
    try {
      const response = await api.patch('/partners/profile', {
        nickname: newNickname.trim(),
      })

      // 스토어 업데이트
      if (user) {
        setAuth(useAuthStore.getState().token!, {
          ...user,
          nickname: newNickname.trim(),
        })
      }

      setIsNicknameSheetOpen(false)
      setNewNickname('')
    } catch (error: any) {
      alert(error.response?.data?.error || '닉네임 변경에 실패했습니다')
    } finally {
      setIsNicknameLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordError('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('모든 필드를 입력해주세요')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('비밀번호는 6자 이상이어야 합니다')
      return
    }

    setIsPasswordLoading(true)
    try {
      await api.patch('/partners/password', {
        currentPassword,
        newPassword,
      })

      setIsPasswordSheetOpen(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      alert('비밀번호가 변경되었습니다')
    } catch (error: any) {
      setPasswordError(error.response?.data?.error || '비밀번호 변경에 실패했습니다')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {/* 프로필 섹션 */}
      <div className="bg-bg-card px-6 py-8">
        <h1 className="text-heading text-text-primary">
          {user?.nickname || '파트너'}
        </h1>
        <p className="text-body text-text-secondary mt-1">{user?.uniqueCode}</p>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 mt-4 text-body text-text-secondary"
        >
          <span>blooom.kr/{user?.uniqueCode}</span>
          {copied ? (
            <Check className="w-5 h-5 text-status-done" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* 정산서 메뉴 */}
      <div className="mt-3 bg-bg-card">
        <button
          onClick={() => router.push('/partners/settlements')}
          className="w-full px-6 py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-action-primary" />
            <span className="text-body text-text-primary">내 정산서 확인하기</span>
          </div>
          <ChevronRight className="w-5 h-5 text-text-tertiary" />
        </button>
      </div>

      {/* 설정 메뉴 */}
      <div className="mt-3 bg-bg-card">
        <button
          onClick={() => {
            setNewNickname(user?.nickname || '')
            setIsNicknameSheetOpen(true)
          }}
          className="w-full px-6 py-4 flex items-center justify-between"
        >
          <span className="text-body text-text-primary">닉네임 변경</span>
          <ChevronRight className="w-5 h-5 text-text-tertiary" />
        </button>

        <div className="h-px bg-bg-primary mx-6" />

        <button
          onClick={() => setIsPasswordSheetOpen(true)}
          className="w-full px-6 py-4 flex items-center justify-between"
        >
          <span className="text-body text-text-primary">비밀번호 변경</span>
          <ChevronRight className="w-5 h-5 text-text-tertiary" />
        </button>
      </div>

      {/* 로그아웃 */}
      <div className="mt-3 bg-bg-card">
        <button
          onClick={handleLogout}
          className="w-full px-6 py-4 text-left"
        >
          <span className="text-body text-error">로그아웃</span>
        </button>
      </div>

      {/* 버전 정보 */}
      <div className="mt-8 text-center">
        <p className="text-small text-text-tertiary">버전 1.0.0</p>
      </div>

      {/* 닉네임 변경 바텀시트 */}
      {isNicknameSheetOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-overlay"
            onClick={() => setIsNicknameSheetOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-bg-card rounded-t-[20px] p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-title text-text-primary">닉네임 변경</h2>
              <button onClick={() => setIsNicknameSheetOpen(false)}>
                <X className="w-6 h-6 text-text-secondary" />
              </button>
            </div>

            <input
              type="text"
              placeholder="새 닉네임 입력"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="w-full px-4 py-4 bg-bg-primary rounded-input text-body text-text-primary placeholder:text-text-tertiary mb-4"
            />

            <button
              onClick={handleNicknameChange}
              disabled={isNicknameLoading || !newNickname.trim()}
              className="w-full py-4 bg-action-primary hover:bg-action-primary-hover disabled:bg-text-tertiary text-white rounded-button text-body font-semibold flex items-center justify-center gap-2"
            >
              {isNicknameLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                '저장'
              )}
            </button>
          </div>
        </div>
      )}

      {/* 비밀번호 변경 바텀시트 */}
      {isPasswordSheetOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-overlay"
            onClick={() => setIsPasswordSheetOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-bg-card rounded-t-[20px] p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-title text-text-primary">비밀번호 변경</h2>
              <button onClick={() => setIsPasswordSheetOpen(false)}>
                <X className="w-6 h-6 text-text-secondary" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-4 bg-bg-primary rounded-input text-body text-text-primary placeholder:text-text-tertiary"
              />
              <input
                type="password"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-4 bg-bg-primary rounded-input text-body text-text-primary placeholder:text-text-tertiary"
              />
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-4 bg-bg-primary rounded-input text-body text-text-primary placeholder:text-text-tertiary"
              />
            </div>

            {passwordError && (
              <p className="text-error text-caption mb-4">{passwordError}</p>
            )}

            <button
              onClick={handlePasswordChange}
              disabled={isPasswordLoading}
              className="w-full py-4 bg-action-primary hover:bg-action-primary-hover disabled:bg-text-tertiary text-white rounded-button text-body font-semibold flex items-center justify-center gap-2"
            >
              {isPasswordLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                '변경'
              )}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
