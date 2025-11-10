'use client'

import { useState } from 'react'

// Mock 데이터
const mockNetwork = [
  {
    id: 2,
    nickname: '김팀장',
    uniqueCode: 'A00002',
    level: 2,
    status: 'ACTIVE',
    createdAt: '2024-10-15',
    childrenCount: 3,
  },
  {
    id: 3,
    nickname: '이과장',
    uniqueCode: 'A00003',
    level: 2,
    status: 'ACTIVE',
    createdAt: '2024-10-20',
    childrenCount: 5,
  },
  {
    id: 4,
    nickname: '박대리',
    uniqueCode: 'A00004',
    level: 2,
    status: 'ACTIVE',
    createdAt: '2024-10-25',
    childrenCount: 2,
  },
  {
    id: 5,
    nickname: '최사원',
    uniqueCode: 'A00005',
    level: 3,
    status: 'ACTIVE',
    createdAt: '2024-11-01',
    childrenCount: 0,
  },
]

export default function NetworkPage() {
  const [view, setView] = useState<'direct' | 'all'>('direct')
  const [members] = useState(mockNetwork)

  const directMembers = members.filter((m) => m.level === 2)
  const allMembers = members

  const displayMembers = view === 'direct' ? directMembers : allMembers

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        하위 파트너 관리
      </h1>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setView('direct')}
          className={`px-4 py-2 rounded-md ${
            view === 'direct'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          직속 파트너 ({directMembers.length})
        </button>
        <button
          onClick={() => setView('all')}
          className={`px-4 py-2 rounded-md ${
            view === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          전체 조직 ({allMembers.length})
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {displayMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {member.nickname}
                </h3>
                <p className="text-sm text-gray-500">{member.uniqueCode}</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                활성
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">레벨</span>
                <span className="font-medium">Level {member.level}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">하위 파트너</span>
                <span className="font-medium">{member.childrenCount}명</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">가입일</span>
                <span className="font-medium">{member.createdAt}</span>
              </div>
            </div>

            <button className="mt-4 w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              상세보기
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
