import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminAuth } from '@/lib/admin/auth'

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { data: guides, error } = await supabaseAdmin
      .from('guides')
      .select(`
        id, title, slug, is_published, category_id, created_at, updated_at,
        guide_categories (id, name, slug)
      `)
      .order('updated_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      guides: (guides || []).map((guide: any) => ({
        id: guide.id,
        title: guide.title,
        slug: guide.slug,
        isPublished: guide.is_published,
        categoryId: guide.category_id,
        category: guide.guide_categories,
        createdAt: guide.created_at,
        updatedAt: guide.updated_at,
      })),
    })
  } catch (error) {
    console.error('Guides list error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { title, slug, content, isPublished, categoryId } = await request.json()

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요' },
        { status: 400 }
      )
    }

    // Check for duplicate slug
    const { data: existing } = await supabaseAdmin
      .from('guides')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: '이미 사용 중인 슬러그입니다' },
        { status: 400 }
      )
    }

    const { data: guide, error } = await supabaseAdmin
      .from('guides')
      .insert({
        title,
        slug,
        content,
        is_published: isPublished || false,
        category_id: categoryId || null,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      guide: {
        id: guide.id,
        title: guide.title,
        slug: guide.slug,
        isPublished: guide.is_published,
        createdAt: guide.created_at,
        updatedAt: guide.updated_at,
      },
    })
  } catch (error) {
    console.error('Create guide error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
