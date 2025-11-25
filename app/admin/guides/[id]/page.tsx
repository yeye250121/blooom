'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import AdminLayout from '@/components/admin/AdminLayout'
import api from '@/lib/admin/api'
import { ArrowLeft, Save } from 'lucide-react'

// Dynamic import to avoid SSR issues with TipTap
const TipTapEditor = dynamic(() => import('@/components/admin/TipTapEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-border rounded-card p-8 bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-action-primary border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export default function EditGuidePage() {
  const router = useRouter()
  const params = useParams()
  const guideId = params.id as string

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchGuide()
  }, [guideId])

  const fetchGuide = async () => {
    try {
      const response = await api.get(`/admin/guides/${guideId}`)
      const guide = response.data.guide
      setTitle(guide.title)
      setSlug(guide.slug)
      setContent(guide.content)
      setIsPublished(guide.isPublished)
    } catch (error) {
      console.error('Failed to fetch guide:', error)
      router.push('/admin/guides')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError('제목을 입력해주세요')
      return
    }
    if (!slug.trim()) {
      setError('슬러그를 입력해주세요')
      return
    }
    if (!content.trim() || content === '<p></p>') {
      setError('내용을 입력해주세요')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      await api.put(`/admin/guides/${guideId}`, {
        title,
        slug,
        content,
        isPublished,
      })
      router.push('/admin/guides')
    } catch (err: any) {
      setError(err.response?.data?.error || '저장에 실패했습니다')
    } finally {
      setIsSaving(false)
    }
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-headline text-text-primary">가이드 수정</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-action-primary text-white rounded-button text-body hover:bg-action-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-5 h-5" />
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>

        <div className="bg-bg-card rounded-card p-6 space-y-4">
          <div>
            <label className="block text-small text-text-secondary mb-2">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-bg-primary rounded-button text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary"
              placeholder="가이드 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-small text-text-secondary mb-2">
              슬러그 (URL)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-body text-text-tertiary">/guides/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 px-4 py-3 bg-bg-primary rounded-button text-body text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-action-primary"
                placeholder="url-slug"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5 rounded border-border text-action-primary focus:ring-action-primary"
            />
            <label htmlFor="isPublished" className="text-body text-text-primary">
              공개
            </label>
          </div>
        </div>

        <div>
          <label className="block text-small text-text-secondary mb-2">
            내용
          </label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        {error && (
          <p className="text-small text-error text-center">{error}</p>
        )}
      </div>
    </AdminLayout>
  )
}
