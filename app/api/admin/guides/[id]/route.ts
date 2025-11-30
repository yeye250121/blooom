import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminAuth } from '@/lib/admin/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { id } = await params
    const guideId = parseInt(id)

    const { data: guide, error } = await supabaseAdmin
      .from('guides')
      .select('*')
      .eq('id', guideId)
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
        isPublished: guide.is_published,
        categoryId: guide.category_id,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { id } = await params
    const guideId = parseInt(id)
    const body = await request.json()

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.title !== undefined) updateData.title = body.title
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.content !== undefined) updateData.content = body.content
    if (body.isPublished !== undefined) updateData.is_published = body.isPublished
    if (body.categoryId !== undefined) updateData.category_id = body.categoryId

    // Check for duplicate slug if updating slug
    if (body.slug) {
      const { data: existing } = await supabaseAdmin
        .from('guides')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', guideId)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: '이미 사용 중인 슬러그입니다' },
          { status: 400 }
        )
      }
    }

    const { error } = await supabaseAdmin
      .from('guides')
      .update(updateData)
      .eq('id', guideId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update guide error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { id } = await params
    const guideId = parseInt(id)

    const { error } = await supabaseAdmin
      .from('guides')
      .delete()
      .eq('id', guideId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete guide error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
