import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getAdminContext } from '@/lib/admin-auth'

const ALLOWED_FIELDS = new Set(['install_location', 'install_count', 'marketer_code'])

export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest) {
  const admin = getAdminContext(request)
  if (!admin) {
    return NextResponse.json({ message: '관리자 인증이 필요합니다' }, { status: 401 })
  }

  const { id, updates } = await request.json()

  if (!id || !updates) {
    return NextResponse.json({ message: 'id와 수정값이 필요합니다' }, { status: 400 })
  }

  const safeUpdates: Record<string, unknown> = {}
  Object.entries(updates).forEach(([key, value]) => {
    if (ALLOWED_FIELDS.has(key) && value !== undefined) {
      safeUpdates[key] = value
    }
  })

  if (Object.keys(safeUpdates).length === 0) {
    return NextResponse.json({ message: '변경 가능한 필드가 없습니다' }, { status: 400 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .update(safeUpdates)
      .eq('id', id)
      .select('id, phone_number, install_location, install_count, marketer_code, submitted_at')
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ inquiry: data })
  } catch (error) {
    return NextResponse.json(
      { message: '문의 정보를 수정하지 못했습니다', details: String(error) },
      { status: 500 }
    )
  }
}

