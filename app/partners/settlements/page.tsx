'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/partners/store'
import api from '@/lib/partners/api'
import PartnerLayout from '@/components/partners/PartnerLayout'
import { ArrowLeft, Download, FileText, Loader2, Calendar } from 'lucide-react'

interface Settlement {
  id: number
  settlementDate: string
  fileName: string
  createdAt: string
}

export default function SettlementsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/partners/login')
      return
    }
    fetchSettlements()
  }, [])

  const fetchSettlements = async () => {
    try {
      const response = await api.get('/partners/settlements')
      setSettlements(response.data.settlements)
    } catch (error) {
      console.error('Failed to fetch settlements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (settlement: Settlement) => {
    setDownloadingId(settlement.id)
    try {
      const response = await api.get(`/partners/settlements/${settlement.id}/download`, {
        responseType: 'blob',
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', settlement.fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert('다운로드에 실패했습니다')
    } finally {
      setDownloadingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
  }

  const formatSettlementDate = (dateString: string) => {
    // settlementDate is in YYYY-MM format
    const [year, month] = dateString.split('-')
    return `${year}년 ${parseInt(month)}월`
  }

  const formatCreatedAt = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <PartnerLayout title="내 정산서" showBackButton onBack={() => router.push('/partners/my')}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-action-primary animate-spin" />
        </div>
      </PartnerLayout>
    )
  }

  return (
    <PartnerLayout title="내 정산서" showBackButton onBack={() => router.push('/partners/my')}>
      {/* 데스크탑 레이아웃 */}
      <div className="hidden lg:block">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/partners/my')}
            className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">내 정산서</h1>
            <p className="text-text-secondary mt-1">월별 정산 내역을 확인하고 다운로드하세요</p>
          </div>
        </div>

        {/* 정산서 목록 */}
        {settlements.length === 0 ? (
          <div className="bg-bg-card rounded-card p-12 text-center">
            <FileText className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <p className="text-body text-text-secondary">등록된 정산서가 없습니다</p>
          </div>
        ) : (
          <div className="bg-bg-card rounded-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-primary">
                  <th className="text-left py-4 px-6 text-caption text-text-secondary font-medium">정산 기간</th>
                  <th className="text-left py-4 px-6 text-caption text-text-secondary font-medium">파일명</th>
                  <th className="text-left py-4 px-6 text-caption text-text-secondary font-medium">등록일</th>
                  <th className="text-right py-4 px-6 text-caption text-text-secondary font-medium">다운로드</th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((settlement) => (
                  <tr key={settlement.id} className="border-b border-border last:border-b-0 hover:bg-bg-primary/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-action-primary/10 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-action-primary" />
                        </div>
                        <span className="text-body text-text-primary font-medium">
                          {formatSettlementDate(settlement.settlementDate)} 정산서
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-body text-text-secondary">{settlement.fileName}</td>
                    <td className="py-4 px-6 text-body text-text-secondary">{formatCreatedAt(settlement.createdAt)}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDownload(settlement)}
                        disabled={downloadingId === settlement.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-action-primary/10 text-action-primary rounded-button text-caption font-medium hover:bg-action-primary/20 transition-colors disabled:opacity-50"
                      >
                        {downloadingId === settlement.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        다운로드
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 모바일 레이아웃 */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="bg-bg-card px-4 py-4 flex items-center gap-3 sticky top-14 z-10">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-title text-text-primary">내 정산서</h1>
        </div>

        {/* Content */}
        <div className="p-4">
          {settlements.length === 0 ? (
            <div className="bg-bg-card rounded-card p-8 text-center">
              <FileText className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
              <p className="text-body text-text-secondary">등록된 정산서가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {settlements.map((settlement) => (
                <div
                  key={settlement.id}
                  className="bg-bg-card rounded-card p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-action-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-action-primary" />
                    </div>
                    <div>
                      <p className="text-body text-text-primary font-medium">
                        {formatSettlementDate(settlement.settlementDate)} 정산서
                      </p>
                      <p className="text-small text-text-tertiary">{settlement.fileName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(settlement)}
                    disabled={downloadingId === settlement.id}
                    className="p-3 text-action-primary hover:bg-action-primary/10 rounded-full transition-colors disabled:opacity-50"
                  >
                    {downloadingId === settlement.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PartnerLayout>
  )
}
