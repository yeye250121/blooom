'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// navigation 배열은 실물 안내 표지판 목록과 같아서, 링크 이름과 목적지를 한 번에 관리할 수 있습니다.
const navigation = [
  { name: '대시보드', href: '/partners/dashboard' },
  { name: '문의 관리', href: '/partners/dashboard/leads' },
  { name: '하위 파트너', href: '/partners/dashboard/network' },
  { name: '수수료 관리', href: '/partners/dashboard/commissions' },
  { name: '파트너스 가이드', href: '/partners/dashboard/partners-guide' },
  { name: '내 정보', href: '/partners/dashboard/my-page' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-gray-200">
      <div className="flex items-center justify-center h-16 bg-gray-200 border-b border-gray-300">
        <span className="text-gray-800 font-bold text-xl">Bloom Partners</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/partners/dashboard' && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-[#ff5757] text-white'
                  : 'text-gray-700 hover:bg-gray-300'
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
