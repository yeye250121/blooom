import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getAdminContext } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const admin = getAdminContext(request)
  if (!admin) {
    return NextResponse.json({ message: '관리자 인증이 필요합니다' }, { status: 401 })
  }

  const { title, category, content, resourceUrl, resourceType, displayOrder = 1, isActive = true } =
    await request.json()

  if (!title || !category || !content) {
    return NextResponse.json({ message: '필수 값이 누락되었습니다' }, { status: 400 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('partner_guides')
      .insert([
        {
          title,
          category,
          content,
          resource_url: resourceUrl || null,
          resource_type: resourceType || 'text',
          display_order: displayOrder,
          is_active: isActive,
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ guide: data })
  } catch (error) {
    return NextResponse.json(
      { message: '가이드를 추가하지 못했습니다', details: String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const admin = getAdminContext(request)
  if (!admin) {
    return NextResponse.json({ message: '관리자 인증이 필요합니다' }, { status: 401 })
  }

  const { id, updates } = await request.json()

  if (!id || !updates) {
    return NextResponse.json({ message: 'id와 수정값이 필요합니다' }, { status: 400 })
  }

  // 공구함에서 필요한 공구만 꺼내 쓰듯, 사용할 컬럼만 골라냅니다.
  const safeUpdates: Record<string, unknown> = {}
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined) return
    if (key === 'resourceUrl') {
      safeUpdates['resource_url'] = value
    } else if (key === 'resourceType') {
      safeUpdates['resource_type'] = value
    } else if (key === 'displayOrder') {
      safeUpdates['display_order'] = value
    } else if (key === 'isActive') {
      safeUpdates['is_active'] = value
    } else {
      safeUpdates[key] = value
    }
  })

  if (Object.keys(safeUpdates).length === 0) {
    return NextResponse.json({ message: '변경 가능한 필드가 없습니다' }, { status: 400 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('partner_guides')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ guide: data })
  } catch (error) {
    return NextResponse.json(
      { message: '가이드를 수정하지 못했습니다', details: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const admin = getAdminContext(request)
  if (!admin) {
    return NextResponse.json({ message: '관리자 인증이 필요합니다' }, { status: 401 })
  }

  const { id } = await request.json()

  if (!id) {
    return NextResponse.json({ message: 'id가 필요합니다' }, { status: 400 })
  }

  try {
    const { error } = await supabaseAdmin.from('partner_guides').delete().eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { message: '가이드를 삭제하지 못했습니다', details: String(error) },
      { status: 500 }
    )
  }
}

