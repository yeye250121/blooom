'use client'

import { useState } from 'react'

// Mock 데이터
const mockLeads = [
  {
    id: 1,
    customerName: '김철수',
    customerPhone: '010-1234-5678',
    productName: 'CCTV 기본형',
    status: 'NEW',
    createdAt: '2024-11-01',
    memo: '오후 3시 방문 예정',
  },
  {
    id: 2,
    customerName: '이영희',
    customerPhone: '010-2345-6789',
    productName: 'KT 인터넷 1기가',
    status: 'CONTACTED',
    createdAt: '2024-11-03',
    memo: '견적 발송 완료',
  },
  {
    id: 3,
    customerName: '박민수',
    customerPhone: '010-3456-7890',
    productName: 'LG U+ 인터넷',
    status: 'SALE_COMPLETED',
    createdAt: '2024-11-05',
    memo: '계약 완료',
  },
]

const statusColors: any = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  SALE_COMPLETED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
}

const statusLabels: any = {
  NEW: '신규',
  CONTACTED: '접촉중',
  SALE_COMPLETED: '판매완료',
  CANCELED: '취소',
}

export default function LeadsPage() {
  const [leads] = useState(mockLeads)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">문의 관리</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
          + 새 문의 추가
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                고객명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                연락처
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                등록일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                메모
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {lead.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.customerPhone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusColors[lead.status]
                    }`}
                  >
                    {statusLabels[lead.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.createdAt}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {lead.memo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        총 {leads.length}건의 문의
      </div>
    </div>
  )
}
