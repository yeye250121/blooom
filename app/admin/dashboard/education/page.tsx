'use client'

import { useState } from 'react'

// Mock 데이터
const mockMaterials = [
  {
    id: 1,
    category: '영업노하우',
    title: '첫 고객 응대 가이드',
    content:
      '고객과의 첫 만남에서 신뢰를 쌓는 방법에 대해 설명합니다. 첫인상이 중요하며, 고객의 니즈를 정확히 파악하는 것이 핵심입니다.',
    createdAt: '2024-10-15',
  },
  {
    id: 2,
    category: 'CCTV',
    title: 'CCTV 상품 설명서',
    content:
      'CCTV 기본형 상품에 대한 상세 설명입니다. 설치 위치, 화질, 저장 용량 등 고객이 궁금해하는 주요 사항들을 다룹니다.',
    createdAt: '2024-10-18',
    videoUrl: 'https://youtube.com/example',
  },
  {
    id: 3,
    category: '인터넷',
    title: '인터넷 요금제 비교',
    content:
      '각 통신사별 인터넷 요금제 비교 자료입니다. KT, LG U+, SK 등 주요 통신사의 요금제를 비교하여 고객에게 최적의 선택을 제안할 수 있습니다.',
    createdAt: '2024-10-20',
  },
  {
    id: 4,
    category: '영업노하우',
    title: '효과적인 세일즈 프레젠테이션',
    content:
      '상품을 효과적으로 소개하고 계약을 성사시키는 프레젠테이션 기법을 소개합니다.',
    createdAt: '2024-10-25',
  },
  {
    id: 5,
    category: 'CCTV',
    title: 'CCTV 설치 사례집',
    content:
      '실제 CCTV 설치 사례를 통해 다양한 환경에서의 설치 노하우를 공유합니다.',
    createdAt: '2024-11-01',
    fileUrl: '/files/cctv-cases.pdf',
  },
]

const categories = ['전체', '영업노하우', 'CCTV', '인터넷']

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)

  const filteredMaterials =
    selectedCategory === '전체'
      ? mockMaterials
      : mockMaterials.filter((m) => m.category === selectedCategory)

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">영업 가이드</h1>

      {/* 카테고리 필터 */}
      <div className="mb-6 flex gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* 자료 목록 */}
        <div className="space-y-4">
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              onClick={() => setSelectedMaterial(material)}
              className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                selectedMaterial?.id === material.id
                  ? 'ring-2 ring-primary-500'
                  : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {material.title}
                </h3>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {material.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {material.content}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{material.createdAt}</span>
                {material.videoUrl && <span>📹 동영상 있음</span>}
                {material.fileUrl && <span>📄 파일 첨부</span>}
              </div>
            </div>
          ))}
        </div>

        {/* 자료 상세 */}
        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
          {selectedMaterial ? (
            <div>
              <div className="mb-4">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {selectedMaterial.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedMaterial.title}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                작성일: {selectedMaterial.createdAt}
              </p>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {selectedMaterial.content}
                </p>
              </div>

              {selectedMaterial.videoUrl && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">동영상 자료</h3>
                  <a
                    href={selectedMaterial.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    📹 동영상 보기
                  </a>
                </div>
              )}

              {selectedMaterial.fileUrl && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">첨부 파일</h3>
                  <a
                    href={selectedMaterial.fileUrl}
                    download
                    className="text-primary-600 hover:underline"
                  >
                    📄 파일 다운로드
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              자료를 선택해주세요
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
