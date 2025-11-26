'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  FileText,
  BookOpen,
  User,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/lib/partners/store'
import { useRouter } from 'next/navigation'

const menuItems = [
  { href: '/partners/home', label: '홈', icon: Home },
  { href: '/partners/inquiries', label: '문의 관리', icon: FileText },
  { href: '/partners/guides', label: '가이드', icon: BookOpen },
  { href: '/partners/my', label: '마이페이지', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/partners/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-bg-card border-r border-border flex flex-col">
      {/* 로고 */}
      <div className="p-6 border-b border-border">
        <h1 className="text-title text-text-primary">Blooom</h1>
        <p className="text-small text-text-secondary mt-1">
          {user?.nickname || '파트너'}
        </p>
        <p className="text-caption text-text-tertiary">
          {user?.uniqueCode}
        </p>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-button transition-colors ${
                    isActive
                      ? 'bg-action-primary text-white'
                      : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-body">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 로그아웃 */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-button text-text-secondary hover:bg-bg-primary hover:text-error transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-body">로그아웃</span>
        </button>
      </div>
    </aside>
  )
}
