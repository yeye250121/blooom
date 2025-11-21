'use client'

import { FormEvent, useEffect, useState } from 'react'

interface AdminUser {
  id: string
  login_id: string
  nickname: string
  unique_code: string
  referrer_code: string | null
  level: number
  created_at: string
}

interface AdminInquiry {
  id: string
  phone_number: string
  install_location: string
  install_count: number
  marketer_code: string | null
  submitted_at: string
}

interface AdminGuide {
  id: string
  title: string
  category: string
  content: string
  resource_url: string | null
  resource_type: string
  display_order: number
  is_active: boolean
}

interface AdminOverview {
  users: AdminUser[]
  inquiries: AdminInquiry[]
  guides: AdminGuide[]
  debug?: any // 디버깅용 정보
}

interface AdminAuthState {
  token: string
  marketer: {
    id: string
    loginId: string
    nickname: string
    uniqueCode: string
    level: number
  }
}

const ADMIN_STORAGE_KEY = 'admin-auth'

export default function AdminPage() {
  // useState는 책상 위에 놓인 부기장처럼, 값을 적어두고 계속 참고할 수 있게 해줍니다.
  const [auth, setAuth] = useState<AdminAuthState | null>(null)
  const [loginForm, setLoginForm] = useState({ loginId: '', password: '' })
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newGuide, setNewGuide] = useState({
    title: '',
    category: '',
    content: '',
    resourceUrl: '',
  })

  // useEffect는 알람 시계처럼 특정 시점(여기서는 컴포넌트가 처음 켜질 때)에만 동작하게 만드는 장치입니다.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(ADMIN_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AdminAuthState
        setAuth(parsed)
      } catch (error) {
        console.warn('Failed to parse stored admin auth:', error)
        window.localStorage.removeItem(ADMIN_STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    if (!auth) {
      setOverview(null)
      return
    }
    fetchOverview()
  }, [auth])

  const fetchOverview = async () => {
    if (!auth?.token) return
    setLoading(true)
    setError('')
    try {
      console.log('관리자 API 호출 시작')
      console.log('토큰:', auth.token.substring(0, 50) + '...')

      // fetch는 배달 대행을 호출해 자료를 수거해 오는 과정과 비슷합니다.
      const response = await fetch('/api/admin/overview', {
        cache: 'no-store', // 중요: 브라우저나 Next.js가 예전 데이터를 기억하지 않도록 강제합니다.
        headers: {
          Authorization: `Bearer ${auth.token}`,
          // Pragma와 Cache-Control 헤더로 이중 안전장치를 겁니다.
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache',
        },
      })

      console.log('응답 상태:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('관리자 API 오류:', errorData)
        // 서버가 보내준 구체적인 에러 메시지를 보여줍니다. (디버깅용)
        throw new Error(errorData.message || errorData.details || '데이터를 불러오는 중 오류가 발생했습니다.')
      }

      const data = (await response.json()) as AdminOverview
      console.log('관리자 데이터 로드 성공:', {
        users: data.users.length,
        inquiries: data.inquiries.length,
        guides: data.guides.length,
      })
      setOverview(data)
    } catch (err: any) {
      setError(err.message || '데이터를 불러오지 못했습니다')
      setOverview(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: loginForm.loginId,
          password: loginForm.password,
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.message || '로그인에 실패했습니다')
      }

      const data = await response.json()
      const marketer = data.marketer

      console.log('로그인 응답 데이터:', data)
      console.log('마케터 정보:', marketer)
      console.log('uniqueCode:', marketer?.uniqueCode)
      console.log('S 코드인가?', marketer?.uniqueCode?.startsWith('S'))

      if (!marketer?.uniqueCode?.startsWith('S')) {
        console.error('S 코드가 아님:', marketer?.uniqueCode)
        throw new Error('S 코드 계정만 관리자 페이지에 접근할 수 있습니다')
      }

      const authState: AdminAuthState = {
        token: data.access_token,
        marketer: {
          id: marketer.id,
          loginId: marketer.loginId,
          nickname: marketer.nickname,
          uniqueCode: marketer.uniqueCode,
          level: marketer.level,
        },
      }

      console.log('인증 상태 저장:', authState)
      setAuth(authState)
      window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(authState))
      setLoginForm({ loginId: '', password: '' })
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다')
      setAuth(null)
      window.localStorage.removeItem(ADMIN_STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setAuth(null)
    setOverview(null)
    window.localStorage.removeItem(ADMIN_STORAGE_KEY)
  }

  const adminFetch = async (url: string, options: RequestInit) => {
    if (!auth?.token) {
      throw new Error('관리자 인증 토큰이 없습니다')
    }

    const response = await fetch(url, {
      ...options,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        ...(options.headers || {}),
      },
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body.message || '요청에 실패했습니다')
    }

    return response.json()
  }

  const handleUserUpdate = async (user: AdminUser, changes: Partial<AdminUser>) => {
    setSaving(true)
    try {
      await adminFetch('/api/admin/users', {
        method: 'PATCH',
        body: JSON.stringify({ id: user.id, updates: changes }),
      })
      await fetchOverview()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleInquiryUpdate = async (inquiry: AdminInquiry, changes: Partial<AdminInquiry>) => {
    setSaving(true)
    try {
      await adminFetch('/api/admin/inquiries', {
        method: 'PATCH',
        body: JSON.stringify({ id: inquiry.id, updates: changes }),
      })
      await fetchOverview()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleGuideUpdate = async (guide: AdminGuide, updates: Record<string, unknown>) => {
    setSaving(true)
    try {
      await adminFetch('/api/admin/guides', {
        method: 'PUT',
        body: JSON.stringify({ id: guide.id, updates }),
      })
      await fetchOverview()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleGuideCreate = async () => {
    if (!newGuide.title || !newGuide.category || !newGuide.content) {
      setError('새 가이드의 필수 항목을 입력해주세요')
      return
    }

    setSaving(true)
    try {
      await adminFetch('/api/admin/guides', {
        method: 'POST',
        body: JSON.stringify({
          title: newGuide.title,
          category: newGuide.category,
          content: newGuide.content,
          resourceUrl: newGuide.resourceUrl || null,
        }),
      })
      setNewGuide({ title: '', category: '', content: '', resourceUrl: '' })
      await fetchOverview()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleGuideDelete = async (guide: AdminGuide) => {
    const confirmed = confirm(`[${guide.title}] 가이드를 삭제하시겠습니까?`)
    if (!confirmed) return

    setSaving(true)
    try {
      await adminFetch('/api/admin/guides', {
        method: 'DELETE',
        body: JSON.stringify({ id: guide.id }),
      })
      await fetchOverview()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!auth) {
    return (
      <div className="max-w-md mx-auto py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">관리자 접근</h1>
        <p className="text-gray-600 mb-6">
          S 코드 계정으로 로그인하면 전체 데이터를 한 눈에 관리할 수 있습니다.
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-3"
            placeholder="로그인 ID"
            value={loginForm.loginId}
            onChange={(e) => setLoginForm((prev) => ({ ...prev, loginId: e.target.value }))}
          />
          <input
            type="password"
            className="w-full border rounded-lg px-4 py-3"
            placeholder="비밀번호"
            value={loginForm.password}
            onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blooom 관리자 콘솔</h1>
          <p className="text-gray-600 mt-2">모든 DB를 한눈에 보고 즉시 수정하세요.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchOverview()}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            새로고침
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            로그아웃
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
      {(loading || saving) && (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
          {loading ? '데이터를 불러오는 중입니다...' : '변경사항을 저장하는 중입니다...'}
        </div>
      )}

      {overview && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <h3 className="text-gray-500 text-sm">등록 파트너</h3>
              <p className="text-3xl font-bold mt-2">{overview.users.length}</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <h3 className="text-gray-500 text-sm">누적 문의</h3>
              <p className="text-3xl font-bold mt-2">{overview.inquiries.length}</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border">
              <h3 className="text-gray-500 text-sm">공개 가이드</h3>
              <p className="text-3xl font-bold mt-2">{overview.guides.length}</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">사용자 관리</h2>
              <p className="text-sm text-gray-500">닉네임/레벨/고유 코드 수정 가능</p>
            </div>
            <div className="space-y-4">
              {overview.users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{user.nickname}</p>
                    <p className="text-sm text-gray-500">
                      {user.login_id} · 코드 {user.unique_code}{' '}
                      {user.referrer_code ? `(상위: ${user.referrer_code})` : '(상위 없음)'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      type="text"
                      defaultValue={user.nickname}
                      onBlur={(e) =>
                        e.target.value !== user.nickname &&
                        handleUserUpdate(user, { nickname: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2"
                    />
                    <input
                      type="text"
                      defaultValue={user.unique_code}
                      onBlur={(e) =>
                        e.target.value !== user.unique_code &&
                        handleUserUpdate(user, { unique_code: e.target.value.toUpperCase() })
                      }
                      className="border rounded-lg px-3 py-2"
                    />
                    <input
                      type="number"
                      min={1}
                      defaultValue={user.level}
                      onBlur={(e) =>
                        Number(e.target.value) !== user.level &&
                        handleUserUpdate(user, { level: Number(e.target.value) })
                      }
                      className="border rounded-lg px-3 py-2 w-24"
                    />
                    <input
                      type="text"
                      placeholder="상위 코드"
                      defaultValue={user.referrer_code || ''}
                      onBlur={(e) =>
                        e.target.value !== (user.referrer_code || '') &&
                        handleUserUpdate(user, {
                          referrer_code: e.target.value ? e.target.value.toUpperCase() : null,
                        })
                      }
                      className="border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">문의 관리</h2>
              <p className="text-sm text-gray-500">설치 정보와 담당 코드를 즉시 수정</p>
            </div>
            <div className="space-y-4">
              {overview.inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="p-4 border rounded-xl flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {inquiry.phone_number} · {inquiry.install_location}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(inquiry.submitted_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      type="text"
                      defaultValue={inquiry.install_location}
                      onBlur={(e) =>
                        e.target.value !== inquiry.install_location &&
                        handleInquiryUpdate(inquiry, { install_location: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2"
                    />
                    <input
                      type="number"
                      min={1}
                      defaultValue={inquiry.install_count}
                      onBlur={(e) =>
                        Number(e.target.value) !== inquiry.install_count &&
                        handleInquiryUpdate(inquiry, { install_count: Number(e.target.value) })
                      }
                      className="border rounded-lg px-3 py-2 w-24"
                    />
                    <input
                      type="text"
                      placeholder="마케터 코드"
                      defaultValue={inquiry.marketer_code || ''}
                      onBlur={(e) =>
                        e.target.value !== (inquiry.marketer_code || '') &&
                        handleInquiryUpdate(inquiry, {
                          marketer_code: e.target.value ? e.target.value.toUpperCase() : null,
                        })
                      }
                      className="border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">파트너 가이드</h2>
              <p className="text-sm text-gray-500">자료를 추가·수정·삭제할 수 있습니다.</p>
            </div>

            <div className="grid gap-4">
              {overview.guides.map((guide) => (
                <div key={guide.id} className="border rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <input
                      type="text"
                      defaultValue={guide.title}
                      onBlur={(e) =>
                        e.target.value !== guide.title &&
                        handleGuideUpdate(guide, { title: e.target.value })
                      }
                      className="text-lg font-semibold text-gray-900 border rounded-lg px-3 py-2 flex-1"
                    />
                    <select
                      defaultValue={guide.category}
                      onChange={(e) => handleGuideUpdate(guide, { category: e.target.value })}
                      className="border rounded-lg px-3 py-2"
                    >
                      <option value="영업노하우">영업노하우</option>
                      <option value="CCTV">CCTV</option>
                      <option value="인터넷">인터넷</option>
                      <option value="기타">기타</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        defaultChecked={guide.is_active}
                        onChange={(e) => handleGuideUpdate(guide, { isActive: e.target.checked })}
                      />
                      공개
                    </label>
                  </div>
                  <textarea
                    defaultValue={guide.content}
                    onBlur={(e) =>
                      e.target.value !== guide.content &&
                      handleGuideUpdate(guide, { content: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    rows={3}
                  />
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      type="text"
                      placeholder="리소스 URL"
                      defaultValue={guide.resource_url || ''}
                      onBlur={(e) =>
                        e.target.value !== (guide.resource_url || '') &&
                        handleGuideUpdate(guide, { resourceUrl: e.target.value || null })
                      }
                      className="border rounded-lg px-3 py-2 flex-1"
                    />
                    <input
                      type="number"
                      min={1}
                      defaultValue={guide.display_order}
                      onBlur={(e) =>
                        Number(e.target.value) !== guide.display_order &&
                        handleGuideUpdate(guide, { displayOrder: Number(e.target.value) })
                      }
                      className="border rounded-lg px-3 py-2 w-32"
                    />
                    <button
                      onClick={() => handleGuideDelete(guide)}
                      className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">새 가이드 추가</h3>
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="제목"
                  value={newGuide.title}
                  onChange={(e) => setNewGuide((prev) => ({ ...prev, title: e.target.value }))}
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="카테고리 (예: 영업노하우)"
                  value={newGuide.category}
                  onChange={(e) => setNewGuide((prev) => ({ ...prev, category: e.target.value }))}
                  className="border rounded-lg px-3 py-2"
                />
                <textarea
                  placeholder="본문 내용"
                  value={newGuide.content}
                  onChange={(e) => setNewGuide((prev) => ({ ...prev, content: e.target.value }))}
                  className="border rounded-lg px-3 py-2"
                  rows={4}
                />
                <input
                  type="text"
                  placeholder="선택: 참고 링크"
                  value={newGuide.resourceUrl}
                  onChange={(e) => setNewGuide((prev) => ({ ...prev, resourceUrl: e.target.value }))}
                  className="border rounded-lg px-3 py-2"
                />
                <button
                  onClick={handleGuideCreate}
                  className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  가이드 추가
                </button>
              </div>
            </div>
          </section>

          {overview.debug && (
            <div className="p-4 bg-gray-100 text-xs font-mono rounded-lg break-all">
              <h4 className="font-bold mb-2">🔍 시스템 진단 정보 (개발자용)</h4>
              <pre>{JSON.stringify(overview.debug, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}

