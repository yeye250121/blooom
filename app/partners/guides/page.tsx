'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/partners/store'
import api from '@/lib/partners/api'
import BottomNav from '@/components/partners/BottomNav'
import { BookOpen, ChevronRight, Loader2 } from 'lucide-react'

interface Guide {
  id: number
  title: string
  slug: string
  createdAt: string
  updatedAt: string
}

export default function GuidesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [guides, setGuides] = useState<Guide[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/partners/login')
      return
    }
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    try {
      const response = await api.get('/guides')
      setGuides(response.data.guides)
    } catch (error) {
      console.error('Failed to fetch guides:', error)
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
      <div className="min-h-screen bg-bg-primary flex items-center justify-center pb-20">
        <Loader2 className="w-8 h-8 text-action-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {/* Header */}
      <div className="bg-bg-card px-6 py-6">
        <h1 className="text-heading text-text-primary">교육자료</h1>
        <p className="text-body text-text-secondary mt-1">
          블룸 파트너를 위한 교육 가이드입니다
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        {guides.length === 0 ? (
          <div className="bg-bg-card rounded-card p-8 text-center">
            <BookOpen className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <p className="text-body text-text-secondary">등록된 교육자료가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {guides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => router.push(`/partners/guides/${guide.slug}`)}
                className="w-full bg-bg-card rounded-card p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-action-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-action-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-body text-text-primary font-medium truncate">
                      {guide.title}
                    </p>
                    <p className="text-small text-text-tertiary">
                      {formatDate(guide.updatedAt)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-tertiary flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
