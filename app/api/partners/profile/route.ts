import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getUserContext } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * 닉네임 변경
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = getUserContext(request)

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { nickname } = await request.json()

    if (!nickname || typeof nickname !== 'string') {
      return NextResponse.json(
        { error: '닉네임을 입력해주세요' },
        { status: 400 }
      )
    }

    if (nickname.length < 2 || nickname.length > 20) {
      return NextResponse.json(
        { error: '닉네임은 2~20자 사이여야 합니다' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ nickname: nickname.trim() })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('[Profile] Update error:', error)
      return NextResponse.json(
        { error: '닉네임 변경에 실패했습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        loginId: data.login_id,
        nickname: data.nickname,
        uniqueCode: data.unique_code,
        level: data.level,
      },
    })
  } catch (error) {
    console.error('[Profile] Error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
