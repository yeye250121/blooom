'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  BookOpen,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/lib/admin/store'
import { useRouter } from 'next/navigation'

const menuItems = [
  { href: '/admin/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/partners', label: '파트너 관리', icon: Users },
  { href: '/admin/inquiries', label: '문의 관리', icon: FileText },
  { href: '/admin/settlements', label: '정산서 관리', icon: Receipt },
  { href: '/admin/guides', label: '가이드 관리', icon: BookOpen },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { admin, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-bg-card border-r border-border flex flex-col">
      {/* 로고 */}
      <div className="p-6 border-b border-border">
        <h1 className="text-title text-text-primary">Blooom Admin</h1>
        <p className="text-small text-text-secondary mt-1">
          {admin?.nickname || admin?.loginId}
        </p>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
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
