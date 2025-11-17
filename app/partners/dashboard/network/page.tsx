'use client'

import { useEffect, useState } from 'react'
import api from '@/app/partners/lib/api'

interface DirectMember {
  id: string
  nickname: string
  unique_code: string
  level: number
  created_at: string
}

export default function NetworkPage() {
  // useState는 노트에 메모를 적어두듯 현재 화면에 보여줄 데이터를 저장합니다.
  const [members, setMembers] = useState<DirectMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // useEffect는 자동 리마인더처럼 컴포넌트가 나타나자마자 데이터를 가져오도록 트리거합니다.
  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/network')
      setMembers(response.data.members)
    } catch (err: any) {
      setError(err.response?.data?.message || '직속 파트너를 불러오지 못했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        하위 파트너
      </h1>
      <p className="text-gray-600 mb-6">
        내 추천 코드로 가입한 직속 파트너만 모아서 보여줍니다.
      </p>

      {loading && (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          데이터를 불러오는 중입니다...
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && members.length === 0 && (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">
            아직 직속 파트너가 없습니다
          </p>
          <p className="text-gray-500">
            추천 링크를 공유하고 첫 파트너를 영입해보세요!
          </p>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {member.nickname}
                </h3>
                <p className="text-sm text-gray-500">{member.unique_code}</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                직속
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>레벨</span>
                <span className="font-medium">Level {member.level}</span>
              </div>
              <div className="flex justify-between">
                <span>가입일</span>
                <span className="font-medium">
                  {new Date(member.created_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
