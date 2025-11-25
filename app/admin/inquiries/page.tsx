'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import api from '@/lib/admin/api'
import { Search, Filter, ChevronDown, ChevronUp, X, Trash2 } from 'lucide-react'

interface Inquiry {
  id: string
  phone: string
  installLocation: string | null
  installCount: number | null
  marketerCode: string
  status: string
  submittedAt: string
}

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'new', label: '신규' },
  { value: 'in_progress', label: '상담중' },
  { value: 'contracted', label: '계약완료' },
  { value: 'cancelled', label: '취소' },
]

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [statusFilter])

  const fetchInquiries = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      const response = await api.get(`/admin/inquiries?${params}`)
      setInquiries(response.data.inquiries)
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      await api.put(`/admin/inquiries/${inquiryId}`, { status: newStatus })
      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
        )
      )
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('상태 변경에 실패했습니다')
    }
  }

  const handleDelete = async (inquiryId: string) => {
    try {
      await api.delete(`/admin/inquiries/${inquiryId}`)
      setInquiries((prev) => prev.filter((i) => i.id !== inquiryId))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete inquiry:', error)
      alert('삭제에 실패했습니다')
    }
  }

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.phone.includes(searchQuery) ||
      inquiry.marketerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.installLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  )

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: '신규',
      in_progress: '상담중',
      contracted: '계약완료',
      cancelled: '취소',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-action-primary/10 text-action-primary',
      in_progress: 'bg-yellow-100 text-yellow-700',
      contracted: 'bg-green-100 text-green-700',
      cancelled: 'bg-gray-100 text-gray-500',
    }
    return colors[status] || 'bg-gray-100 text-gray-500'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-action-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-headline text-text-primary">문의 관리</h1>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="연락처, 설치장소, 담당자 코드로 검색"
              className="w-full pl-12 pr-4 py-3 bg-bg-card rounded-button text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-card rounded-button text-body text-text-secondary hover:text-text-primary transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="sm:hidden">필터</span>
            <span className="hidden sm:inline">상태 필터</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-bg-card rounded-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-small text-text-secondary">상태 필터</span>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-4 py-2 rounded-full text-small transition-colors ${
                    statusFilter === option.value
                      ? 'bg-action-primary text-white'
                      : 'bg-bg-primary text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Inquiries List - Desktop */}
        <div className="hidden lg:block bg-bg-card rounded-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-6 text-small text-text-secondary font-medium">연락처</th>
                <th className="text-left py-4 px-6 text-small text-text-secondary font-medium">설치장소</th>
                <th className="text-left py-4 px-6 text-small text-text-secondary font-medium">설치대수</th>
                <th className="text-left py-4 px-6 text-small text-text-secondary font-medium">담당자 코드</th>
                <th className="text-left py-4 px-6 text-small text-text-secondary font-medium">상태</th>
                <th className="text-left py-4 px-6 text-small text-text-secondary font-medium">신청일</th>
                <th className="text-left py-4 px-6 text-small text-text-secondary font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-border last:border-0">
                  <td className="py-4 px-6 text-body text-text-primary">{inquiry.phone}</td>
                  <td className="py-4 px-6 text-body text-text-secondary max-w-[200px] truncate">
                    {inquiry.installLocation || '-'}
                  </td>
                  <td className="py-4 px-6 text-body text-text-secondary">
                    {inquiry.installCount || '-'}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-body text-action-primary">{inquiry.marketerCode}</span>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-small border-0 cursor-pointer ${getStatusColor(inquiry.status)}`}
                    >
                      <option value="new">신규</option>
                      <option value="in_progress">상담중</option>
                      <option value="contracted">계약완료</option>
                      <option value="cancelled">취소</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-body text-text-tertiary">
                    {formatDate(inquiry.submittedAt)}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setDeleteConfirm(inquiry.id)}
                      className="p-2 text-text-tertiary hover:text-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInquiries.length === 0 && (
            <p className="text-body text-text-secondary text-center py-8">
              문의가 없습니다
            </p>
          )}
        </div>

        {/* Inquiries List - Mobile */}
        <div className="lg:hidden space-y-3">
          {filteredInquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-bg-card rounded-card overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-body text-text-primary font-medium">{inquiry.phone}</span>
                    <span className={`px-2 py-0.5 rounded-full text-small ${getStatusColor(inquiry.status)}`}>
                      {getStatusLabel(inquiry.status)}
                    </span>
                  </div>
                  <p className="text-small text-text-secondary">{inquiry.installLocation || '-'}</p>
                </div>
                {expandedId === inquiry.id ? (
                  <ChevronUp className="w-5 h-5 text-text-tertiary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-tertiary" />
                )}
              </button>

              {expandedId === inquiry.id && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                  <div className="grid grid-cols-2 gap-3 text-small">
                    <div>
                      <span className="text-text-tertiary">담당자 코드</span>
                      <p className="text-action-primary">{inquiry.marketerCode}</p>
                    </div>
                    <div>
                      <span className="text-text-tertiary">신청일</span>
                      <p className="text-text-primary">
                        {formatDate(inquiry.submittedAt)}
                      </p>
                    </div>
                    <div>
                      <span className="text-text-tertiary">설치대수</span>
                      <p className="text-text-primary">{inquiry.installCount || '-'}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <label className="text-small text-text-tertiary mb-1 block">상태 변경</label>
                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                      className="w-full px-4 py-3 bg-bg-primary rounded-button text-body text-text-primary"
                    >
                      <option value="new">신규</option>
                      <option value="in_progress">상담중</option>
                      <option value="contracted">계약완료</option>
                      <option value="cancelled">취소</option>
                    </select>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteConfirm(inquiry.id)
                    }}
                    className="w-full py-2 bg-error/10 text-error rounded-button text-small hover:bg-error/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredInquiries.length === 0 && (
            <div className="bg-bg-card rounded-card p-8 text-center">
              <p className="text-body text-text-secondary">문의가 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-overlay"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-bg-card rounded-card p-6 w-full max-w-sm animate-scale-in">
            <h2 className="text-title text-text-primary mb-2">문의 삭제</h2>
            <p className="text-body text-text-secondary mb-6">
              정말 이 문의를 삭제하시겠습니까?<br />
              삭제된 데이터는 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 bg-bg-primary text-text-primary rounded-button text-body hover:bg-border transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 bg-error text-white rounded-button text-body hover:bg-error/90 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
