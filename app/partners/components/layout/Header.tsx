'use client'

import { useAuthStore } from '@/app/partners/store/authStore'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/partners/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            환영합니다, {user?.nickname}님
          </h2>
          <p className="text-sm text-gray-600">
            코드: {user?.uniqueCode} | Level {user?.level}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </header>
  )
}
