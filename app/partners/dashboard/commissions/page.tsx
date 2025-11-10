'use client'

import { useState } from 'react'

// Mock 데이터
const mockCommissions = [
  {
    id: 1,
    sourceMarketer: '김팀장',
    product: 'CCTV 기본형',
    saleAmount: 1500000,
    commissionAmount: 150000,
    status: 'CONFIRMED',
    createdAt: '2024-11-01',
  },
  {
    id: 2,
    sourceMarketer: '이과장',
    product: 'KT 인터넷 1기가',
    saleAmount: 800000,
    commissionAmount: 80000,
    status: 'PENDING',
    createdAt: '2024-11-03',
  },
  {
    id: 3,
    sourceMarketer: '박대리',
    product: 'LG U+ 인터넷',
    saleAmount: 900000,
    commissionAmount: 90000,
    status: 'PAID',
    createdAt: '2024-10-28',
  },
]

const statusColors: any = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
}

const statusLabels: any = {
  PENDING: '대기중',
  CONFIRMED: '확정',
  PAID: '지급완료',
}

export default function CommissionsPage() {
  const [commissions] = useState(mockCommissions)

  // 수수료 요약
  const pending = commissions
    .filter((c) => c.status === 'PENDING')
    .reduce((sum, c) => sum + c.commissionAmount, 0)
  const confirmed = commissions
    .filter((c) => c.status === 'CONFIRMED')
    .reduce((sum, c) => sum + c.commissionAmount, 0)
  const paid = commissions
    .filter((c) => c.status === 'PAID')
    .reduce((sum, c) => sum + c.commissionAmount, 0)

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">수수료 요약</h1>

      {/* 수수료 요약 카드 */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">지급 대기</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {pending.toLocaleString()}원
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">인출 가능</h3>
          <p className="text-2xl font-bold text-primary-600 mt-2">
            {confirmed.toLocaleString()}원
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">지급 완료</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {paid.toLocaleString()}원
          </p>
        </div>
      </div>

      {/* 수수료 내역 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">수수료 내역</h2>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                발생일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                하위 마케터
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                판매금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수수료
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {commissions.map((commission) => (
              <tr key={commission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {commission.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {commission.sourceMarketer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {commission.product}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {commission.saleAmount.toLocaleString()}원
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                  {commission.commissionAmount.toLocaleString()}원
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusColors[commission.status]
                    }`}
                  >
                    {statusLabels[commission.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        총 {commissions.length}건의 수수료 내역
      </div>
    </div>
  )
}
