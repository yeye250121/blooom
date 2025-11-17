'use client'

import { useEffect, useMemo, useState } from 'react'
import api from '@/app/partners/lib/api'
import { useAuthStore } from '@/app/partners/store/authStore'

interface Guide {
  id: string
  title: string
  category: string
  content: string
  resource_url: string | null
  resource_type: string
  display_order: number
  updated_at: string
}

export default function PartnersGuidePage() {
  // useState는 바인더에 페이지를 덧붙이듯 현재 선택된 자료와 목록을 보관합니다.
  const [guides, setGuides] = useState<Guide[]>([])
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newGuide, setNewGuide] = useState({
    title: '',
    category: '영업노하우',
    content: '',
    resourceUrl: '',
  })

  const user = useAuthStore((state) => state.user)

  const isAdmin = user?.uniqueCode?.startsWith('S')

  // useEffect는 "페이지가 열리면 자료실을 확인하라"는 자동 메모와 같습니다.
  useEffect(() => {
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/guides')
      setGuides(response.data.guides)
      if (response.data.guides.length > 0) {
        setSelectedGuide(response.data.guides[0])
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '가이드 정보를 불러오지 못했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGuide = async () => {
    if (!newGuide.title || !newGuide.category || !newGuide.content) {
      alert('제목, 카테고리, 내용은 필수입니다')
      return
    }

    setCreating(true)
    try {
      await api.post('/guides', newGuide)
      alert('가이드가 생성되었습니다!')
      setNewGuide({
        title: '',
        category: '영업노하우',
        content: '',
        resourceUrl: '',
      })
      setShowCreateForm(false)
      await fetchGuides()
    } catch (err: any) {
      alert(err.response?.data?.message || '가이드 생성에 실패했습니다')
    } finally {
      setCreating(false)
    }
  }

  const categories = useMemo(() => {
    const unique = Array.from(new Set(guides.map((guide) => guide.category)))
    return ['전체', ...unique]
  }, [guides])

  const filteredGuides =
    selectedCategory === '전체'
      ? guides
      : guides.filter((guide) => guide.category === selectedCategory)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">파트너스 가이드</h1>
          <p className="text-gray-600 mt-2">
            관리자가 최신화한 영업 스크립트와 상품 자료를 한곳에 모았습니다.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff5757] text-white rounded-lg hover:opacity-90 font-medium"
          >
            <span className="text-xl">+</span>
            새 가이드 작성
          </button>
        )}
      </div>

      {showCreateForm && isAdmin && (
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">새 가이드 작성</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newGuide.title}
                onChange={(e) => setNewGuide({ ...newGuide, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5757] focus:border-transparent"
                placeholder="가이드 제목을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                value={newGuide.category}
                onChange={(e) => setNewGuide({ ...newGuide, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5757] focus:border-transparent"
              >
                <option value="영업노하우">영업노하우</option>
                <option value="CCTV">CCTV</option>
                <option value="인터넷">인터넷</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newGuide.content}
                onChange={(e) => setNewGuide({ ...newGuide, content: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5757] focus:border-transparent"
                placeholder="가이드 내용을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                참고 자료 URL (선택)
              </label>
              <input
                type="url"
                value={newGuide.resourceUrl}
                onChange={(e) => setNewGuide({ ...newGuide, resourceUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5757] focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={creating}
              >
                취소
              </button>
              <button
                onClick={handleCreateGuide}
                disabled={creating}
                className="px-4 py-2 bg-[#ff5757] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {creating ? '생성 중...' : '가이드 생성'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-xl shadow p-8 text-center">자료를 불러오는 중입니다...</div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mb-6 flex gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-[#ff5757] text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="space-y-4">
              {filteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`bg-white rounded-xl border p-5 cursor-pointer hover:shadow ${
                    selectedGuide?.id === guide.id ? 'border-[#ff5757] shadow-lg' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{guide.title}</h3>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                      {guide.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{guide.content}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    업데이트 {new Date(guide.updated_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}

              {filteredGuides.length === 0 && (
                <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
                  해당 카테고리에 등록된 가이드가 없습니다.
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-6 h-fit">
              {selectedGuide ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                      {selectedGuide.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      최근 업데이트 {new Date(selectedGuide.updated_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedGuide.title}</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedGuide.content}
                  </p>

                  {selectedGuide.resource_url && (
                    <a
                      href={selectedGuide.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-[#ff5757] text-white rounded-lg text-sm font-semibold hover:opacity-90"
                    >
                      참고 자료 열기
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">읽고 싶은 가이드를 선택해주세요.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

