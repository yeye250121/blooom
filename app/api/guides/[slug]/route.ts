import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserContext } from '@/lib/auth'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = getUserContext(request)
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { slug } = await params

    // Get guide by slug (only if published)
    const { data: guide, error } = await supabaseAdmin
      .from('guides')
      .select('id, title, slug, content, created_at, updated_at')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error || !guide) {
      return NextResponse.json(
        { error: '가이드를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      guide: {
        id: guide.id,
        title: guide.title,
        slug: guide.slug,
        content: guide.content,
        createdAt: guide.created_at,
        updatedAt: guide.updated_at,
      },
    })
  } catch (error) {
    console.error('Get guide error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
