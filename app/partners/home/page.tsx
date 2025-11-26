'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/partners/store'
import api from '@/lib/partners/api'
import PartnerLayout from '@/components/partners/PartnerLayout'
import { ChevronRight, Loader2, TrendingUp, Users, FileText, Clock } from 'lucide-react'

interface Stats {
  total: number
  byStatus: {
    new: number
    in_progress: number
    contracted: number
    cancelled: number
  }
}

interface Subordinate {
  uniqueCode: string
  nickname: string
  level: number
  createdAt: string
  inquiryCount: number
}

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  const [stats, setStats] = useState<Stats | null>(null)
  const [subordinates, setSubordinates] = useState<Subordinate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedCode, setExpandedCode] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/partners/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [statsRes, subordinatesRes] = await Promise.all([
        api.get('/partners/stats'),
        api.get('/partners/subordinates'),
      ])
      setStats(statsRes.data)
      setSubordinates(subordinatesRes.data.data || [])
    } catch (error) {
      console.error('데이터 조회 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewInquiries = (code?: string) => {
    if (code) {
      router.push(`/partners/inquiries?partnerCode=${code}`)
    } else {
      router.push('/partners/inquiries')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <PartnerLayout title="홈">
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-action-primary animate-spin" />
        </div>
      </PartnerLayout>
    )
  }

  return (
    <PartnerLayout title="홈">
      {/* 데스크탑 레이아웃 */}
      <div className="hidden lg:block">
        {/* 환영 메시지 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">
            안녕하세요, {user?.nickname || '파트너'}님
          </h1>
          <p className="text-text-secondary mt-1">오늘도 좋은 하루 되세요!</p>
        </div>

        {/* 통계 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* 전체 문의 */}
          <button
            onClick={() => handleViewInquiries()}
            className="bg-bg-card rounded-card p-6 text-left hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-action-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-action-primary" />
              </div>
              <ChevronRight className="w-5 h-5 text-text-tertiary" />
            </div>
            <p className="text-3xl font-bold text-text-primary">{stats?.total || 0}</p>
            <p className="text-body text-text-secondary mt-1">전체 문의</p>
          </button>

          {/* 신규 문의 */}
          <div className="bg-bg-card rounded-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-status-new/10 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-status-new" />
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{stats?.byStatus.new || 0}</p>
            <p className="text-body text-text-secondary mt-1">신규 문의</p>
          </div>

          {/* 상담중 */}
          <div className="bg-bg-card rounded-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-status-progress/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-status-progress" />
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{stats?.byStatus.in_progress || 0}</p>
            <p className="text-body text-text-secondary mt-1">상담중</p>
          </div>

          {/* 계약완료 */}
          <div className="bg-bg-card rounded-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-status-done/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-status-done" />
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{stats?.byStatus.contracted || 0}</p>
            <p className="text-body text-text-secondary mt-1">계약완료</p>
          </div>
        </div>

        {/* 하위 파트너 섹션 */}
        {subordinates.length > 0 && (
          <div className="bg-bg-card rounded-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-title text-text-primary">하위 파트너</h2>
              <span className="text-caption text-text-secondary">{subordinates.length}명</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-caption text-text-secondary font-medium">코드</th>
                    <th className="text-left py-3 px-4 text-caption text-text-secondary font-medium">닉네임</th>
                    <th className="text-left py-3 px-4 text-caption text-text-secondary font-medium">레벨</th>
                    <th className="text-left py-3 px-4 text-caption text-text-secondary font-medium">가입일</th>
                    <th className="text-right py-3 px-4 text-caption text-text-secondary font-medium">문의</th>
                    <th className="text-right py-3 px-4 text-caption text-text-secondary font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {subordinates.map((sub) => (
                    <tr key={sub.uniqueCode} className="border-b border-border last:border-b-0 hover:bg-bg-primary transition-colors">
                      <td className="py-4 px-4 text-body text-text-primary font-medium">{sub.uniqueCode}</td>
                      <td className="py-4 px-4 text-body text-text-secondary">{sub.nickname}</td>
                      <td className="py-4 px-4 text-body text-text-secondary">Lv.{sub.level}</td>
                      <td className="py-4 px-4 text-body text-text-secondary">{formatDate(sub.createdAt)}</td>
                      <td className="py-4 px-4 text-body text-text-primary text-right">{sub.inquiryCount}건</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleViewInquiries(sub.uniqueCode)}
                          className="px-4 py-2 bg-action-primary/10 text-action-primary rounded-button text-caption font-medium hover:bg-action-primary/20 transition-colors"
                        >
                          문의 보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 모바일 레이아웃 */}
      <div className="lg:hidden">
        {/* 문의 통계 섹션 */}
        <button
          onClick={() => handleViewInquiries()}
          className="w-full bg-bg-card px-6 py-8 text-left"
        >
          <p className="text-[48px] font-bold text-text-primary">
            {stats?.total || 0}
          </p>
          <p className="text-body text-text-secondary">전체 문의</p>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-new" />
              <span className="text-caption text-text-secondary">
                {stats?.byStatus.new || 0} 신규
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-progress" />
              <span className="text-caption text-text-secondary">
                {stats?.byStatus.in_progress || 0} 상담중
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-done" />
              <span className="text-caption text-text-secondary">
                {stats?.byStatus.contracted || 0} 완료
              </span>
            </div>
          </div>
        </button>

        {/* 하위 파트너 섹션 */}
        {subordinates.length > 0 && (
          <div className="bg-bg-primary px-6 py-6">
            <p className="text-caption text-text-secondary mb-4">
              {subordinates.length}명의 하위 파트너
            </p>

            <div className="space-y-3">
              {subordinates.map((sub) => (
                <div key={sub.uniqueCode} className="bg-bg-card rounded-card overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedCode(
                        expandedCode === sub.uniqueCode ? null : sub.uniqueCode
                      )
                    }
                    className="w-full px-5 py-4 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-body text-text-primary">
                        {sub.uniqueCode}
                      </span>
                      <span className="text-body text-text-secondary ml-2">
                        {sub.nickname}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-caption text-text-secondary">
                        {sub.inquiryCount}건
                      </span>
                      <ChevronRight
                        className={`w-5 h-5 text-text-tertiary transition-transform ${
                          expandedCode === sub.uniqueCode ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {expandedCode === sub.uniqueCode && (
                    <div className="px-5 pb-5 pt-2 bg-bg-primary">
                      <div className="space-y-2 mb-4">
                        <p className="text-caption text-text-secondary">
                          레벨: {sub.level}
                        </p>
                        <p className="text-caption text-text-secondary">
                          가입일: {formatDate(sub.createdAt)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleViewInquiries(sub.uniqueCode)}
                        className="w-full py-3 bg-bg-card rounded-button text-body text-action-primary font-medium"
                      >
                        문의 보기
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PartnerLayout>
  )
}
