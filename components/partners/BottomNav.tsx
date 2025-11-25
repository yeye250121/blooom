'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, BookOpen, User } from 'lucide-react'

const navItems = [
  { href: '/partners/home', label: '홈', icon: Home },
  { href: '/partners/inquiries', label: '문의관리', icon: FileText },
  { href: '/partners/guides', label: '가이드', icon: BookOpen },
  { href: '/partners/my', label: '마이', icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-card border-t border-bg-primary">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-action-primary' : 'text-text-tertiary'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-small mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
