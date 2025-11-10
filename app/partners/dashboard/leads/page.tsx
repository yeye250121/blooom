'use client'

import { useState, useEffect } from 'react'
import api from '@/app/admin/lib/api'
import { useAuthStore } from '@/app/admin/store/authStore'

interface Inquiry {
  id: string
  phone_number: string
  install_location: string
  install_count: number
  referrer_url: string | null
  submitted_at: string
  created_at: string
  privacy_consent: boolean
  marketer_code: string | null
}

export default function LeadsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    fetchInquiries()
  }, [page])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/inquiries?page=${page}&limit=10`)
      setInquiries(response.data.inquiries)
      setTotal(response.data.total)
      setTotalPages(response.data.totalPages)
    } catch (error: any) {
      console.error('문의 조회 오류:', error)
      alert(error.response?.data?.message || '문의 목록을 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('복사되었습니다!')
  }

  if (loading && inquiries.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">문의 관리</h1>
          <p className="mt-2 text-sm text-gray-600">
            내 랜딩페이지: <span className="font-mono text-blue-600">
              {window.location.origin}/{user?.uniqueCode}
            </span>
            <button
              onClick={() => copyToClipboard(`${window.location.origin}/${user?.uniqueCode}`)}
              className="ml-2 text-blue-600 hover:text-blue-700"
              title="URL 복사"
            >
              📋
            </button>
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">아직 문의가 없습니다</p>
          <p className="mt-2 text-gray-400 text-sm">
            랜딩페이지를 공유하고 첫 문의를 받아보세요!
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    연락처
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    설치 지역
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    설치 대수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    유입 경로
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등록일시
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <button
                        onClick={() => copyToClipboard(inquiry.phone_number)}
                        className="hover:text-blue-600"
                        title="전화번호 복사"
                      >
                        {formatPhoneNumber(inquiry.phone_number)}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inquiry.install_location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inquiry.install_count}대
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {inquiry.referrer_url || '직접 접속'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(inquiry.submitted_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              총 {total}건의 문의
            </div>

            {totalPages > 1 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  이전
                </button>
                <span className="px-3 py-1 text-sm text-gray-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
