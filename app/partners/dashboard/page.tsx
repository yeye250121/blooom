'use client'

import Link from 'next/link'
import { useAuthStore } from '@/app/partners/store/authStore'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800">대시보드</h1>
      <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">환영합니다</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {user?.nickname}님
          </p>
          <p className="text-sm text-gray-600 mt-1">
            고유 코드: {user?.uniqueCode}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">레벨</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            Level {user?.level}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium">인출 가능 수수료</h3>
          <p className="text-2xl font-bold text-primary-600 mt-2">0원</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          주요 기능 바로가기
        </h2>
        {/* 링크 카드들은 사무실 층별 안내판처럼 핵심 화면으로 바로 이동할 수 있게 도와줍니다. */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Link
            href="/partners/dashboard/leads"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800">문의 관리</h3>
            <p className="text-gray-600 mt-2">고객 DB 및 리드 관리</p>
          </Link>
          <Link
            href="/partners/dashboard/network"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800">직속 파트너</h3>
            <p className="text-gray-600 mt-2">내 추천 코드로 등록한 팀원</p>
          </Link>
          <Link
            href="/partners/dashboard/commissions"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800">수수료 관리</h3>
            <p className="text-gray-600 mt-2">지급 일정과 내역</p>
          </Link>
          <Link
            href="/partners/dashboard/partners-guide"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800">파트너스 가이드</h3>
            <p className="text-gray-600 mt-2">관리자가 갱신한 교육 자료</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
