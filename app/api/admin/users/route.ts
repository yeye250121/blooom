import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getAdminContext } from '@/lib/admin-auth'

const ALLOWED_FIELDS = new Set(['nickname', 'level', 'unique_code', 'referrer_code'])

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

  // 허용된 필드만 남기는 과정은 보험 설계사가 필요한 서류만 골라 받는 것과 유사합니다.
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
      .from('users')
      .update(safeUpdates)
      .eq('id', id)
      .select('id, login_id, nickname, unique_code, referrer_code, level')
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ user: data })
  } catch (error) {
    return NextResponse.json(
      { message: '사용자 정보를 수정하지 못했습니다', details: String(error) },
      { status: 500 }
    )
  }
}

