'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import api from '@/lib/admin/api'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'

interface Guide {
  id: number
  title: string
  slug: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export default function GuidesPage() {
  const router = useRouter()
  const [guides, setGuides] = useState<Guide[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    try {
      const response = await api.get('/admin/guides')
      setGuides(response.data.guides)
    } catch (error) {
      console.error('Failed to fetch guides:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePublish = async (guide: Guide) => {
    try {
      await api.put(`/admin/guides/${guide.id}`, {
        isPublished: !guide.isPublished,
      })
      setGuides((prev) =>
        prev.map((g) =>
          g.id === guide.id ? { ...g, isPublished: !g.isPublished } : g
        )
      )
    } catch (error) {
      console.error('Failed to toggle publish:', error)
      alert('상태 변경에 실패했습니다')
    }
  }

  const handleDelete = async (guideId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      await api.delete(`/admin/guides/${guideId}`)
      fetchGuides()
    } catch (error) {
      console.error('Failed to delete guide:', error)
      alert('삭제에 실패했습니다')
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-headline text-text-primary">가이드 관리</h1>
          <button
            onClick={() => router.push('/admin/guides/new')}
            className="flex items-center gap-2 px-4 py-2 bg-action-primary text-white rounded-button text-body hover:bg-action-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            가이드 작성
          </button>
        </div>

        {/* Guides List */}
        <div className="bg-bg-card rounded-card overflow-hidden">
          {guides.length > 0 ? (
            <div className="divide-y divide-border">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-body text-text-primary font-medium truncate">
                        {guide.title}
                      </h3>
                      {guide.isPublished ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-small">
                          공개
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-small">
                          비공개
                        </span>
                      )}
                    </div>
                    <p className="text-small text-text-tertiary">
                      /{guide.slug} · {new Date(guide.updatedAt).toLocaleDateString('ko-KR')} 수정
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePublish(guide)}
                      className="p-2 text-text-secondary hover:text-action-primary transition-colors"
                      title={guide.isPublished ? '비공개로 전환' : '공개로 전환'}
                    >
                      {guide.isPublished ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => router.push(`/admin/guides/${guide.id}`)}
                      className="p-2 text-text-secondary hover:text-action-primary transition-colors"
                      title="수정"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(guide.id)}
                      className="p-2 text-text-secondary hover:text-error transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body text-text-secondary text-center py-8">
              가이드가 없습니다
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
