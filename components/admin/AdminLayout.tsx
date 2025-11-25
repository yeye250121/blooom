'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/admin/store'
import Sidebar from './Sidebar'
import { Menu, X } from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login')
    } else {
      setIsChecking(false)
    }
  }, [])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-action-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* 데스크탑 사이드바 */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* 모바일 헤더 */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-bg-card border-b border-border flex items-center justify-between px-4 z-40">
        <h1 className="text-title text-text-primary">Blooom Admin</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-text-secondary"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 animate-slide-right">
            <Sidebar />
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
