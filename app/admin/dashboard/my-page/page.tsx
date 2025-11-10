'use client'

import { useAuthStore } from '@/app/admin/store/authStore'
import { useState } from 'react'

export default function MyPage() {
  const user = useAuthStore((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">내 정보</h1>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* 프로필 카드 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  {user?.nickname.charAt(0)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {user?.nickname}
              </h2>
              <p className="text-sm text-gray-500">{user?.loginId}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">고유 코드</span>
                <span className="font-semibold text-primary-600">
                  {user?.uniqueCode}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">레벨</span>
                <span className="font-semibold">Level {user?.level}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">상태</span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  활성
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 정보 수정 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                계정 정보
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {isEditing ? '취소' : '수정'}
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아이디
                </label>
                <input
                  type="text"
                  value={user?.loginId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  아이디는 변경할 수 없습니다
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <input
                  type="text"
                  value={user?.nickname}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                    isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
                  }`}
                />
              </div>

              {isEditing && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      새 비밀번호
                    </label>
                    <input
                      type="password"
                      placeholder="새 비밀번호 (변경 시에만 입력)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      비밀번호 확인
                    </label>
                    <input
                      type="password"
                      placeholder="비밀번호 확인"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    변경사항 저장
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 추천 링크 */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              내 추천 링크
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              아래 코드를 공유하여 새로운 회원을 초대하세요
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={user?.uniqueCode}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-center text-lg font-mono font-bold"
              />
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                복사
              </button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                💡 회원가입 시 이 코드를 입력하면 당신의 하위 조직원이 됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
