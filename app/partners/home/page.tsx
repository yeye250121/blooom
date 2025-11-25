'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/partners/store'
import api from '@/lib/partners/api'
import BottomNav from '@/components/partners/BottomNav'
import { ChevronRight, Loader2 } from 'lucide-react'

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
  const { isAuthenticated } = useAuthStore()

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
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-action-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
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

      <BottomNav />
    </div>
  )
}
