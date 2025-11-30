import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminAuth } from '@/lib/admin/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// PUT: 카테고리 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { name, display_order } = body

    const updateData: Record<string, unknown> = {}

    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json({ error: '카테고리명을 입력해주세요' }, { status: 400 })
      }

      // 중복 확인 (자기 자신 제외)
      const { data: existing } = await supabase
        .from('guide_categories')
        .select('id')
        .eq('name', name.trim())
        .neq('id', id)
        .single()

      if (existing) {
        return NextResponse.json({ error: '이미 존재하는 카테고리명입니다' }, { status: 400 })
      }

      updateData.name = name.trim()
      updateData.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    if (display_order !== undefined) {
      updateData.display_order = display_order
    }

    const { data: category, error } = await supabase
      .from('guide_categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update category:', error)
      return NextResponse.json({ error: '카테고리 수정 실패' }, { status: 500 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Category PUT error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// DELETE: 카테고리 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { id } = params

    // 해당 카테고리의 가이드들은 category_id를 null로 설정 (ON DELETE SET NULL)
    const { error } = await supabase
      .from('guide_categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete category:', error)
      return NextResponse.json({ error: '카테고리 삭제 실패' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Category DELETE error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
