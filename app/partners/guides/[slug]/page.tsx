'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/lib/partners/store'
import api from '@/lib/partners/api'
import { ArrowLeft, Loader2 } from 'lucide-react'

interface Guide {
  id: number
  title: string
  slug: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function GuideDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated } = useAuthStore()

  const [guide, setGuide] = useState<Guide | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/partners/login')
      return
    }
    fetchGuide()
  }, [params.slug])

  const fetchGuide = async () => {
    try {
      const response = await api.get(`/guides/${params.slug}`)
      setGuide(response.data.guide)
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('가이드를 찾을 수 없습니다')
      } else {
        setError('가이드를 불러오는데 실패했습니다')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-action-primary animate-spin" />
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="bg-bg-card px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-title text-text-primary">교육자료</h1>
        </div>
        <div className="p-4">
          <div className="bg-bg-card rounded-card p-8 text-center">
            <p className="text-body text-text-secondary">{error || '가이드를 찾을 수 없습니다'}</p>
            <button
              onClick={() => router.push('/partners/guides')}
              className="mt-4 px-4 py-2 bg-action-primary text-white rounded-button text-body"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-card px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-title text-text-primary truncate flex-1">{guide.title}</h1>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="bg-bg-card rounded-card p-6">
          <div className="mb-4 pb-4 border-b border-border">
            <h2 className="text-heading text-text-primary mb-2">{guide.title}</h2>
            <p className="text-small text-text-tertiary">
              최종 수정: {formatDate(guide.updatedAt)}
            </p>
          </div>

          {/* TipTap content rendering */}
          <div
            className="tiptap-content prose prose-sm max-w-none text-text-primary"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />
        </div>
      </div>

      {/* Styles for TipTap content */}
      <style jsx global>{`
        .tiptap-content h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }
        .tiptap-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .tiptap-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .tiptap-content p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        .tiptap-content ul, .tiptap-content ol {
          margin-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .tiptap-content ul {
          list-style-type: disc;
        }
        .tiptap-content ol {
          list-style-type: decimal;
        }
        .tiptap-content li {
          margin-bottom: 0.25rem;
        }
        .tiptap-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        .tiptap-content strong {
          font-weight: 600;
        }
        .tiptap-content em {
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
