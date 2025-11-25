import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getUserContext } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

/**
 * 비밀번호 변경
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = getUserContext(request)

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '현재 비밀번호와 새 비밀번호를 입력해주세요' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 6자 이상이어야 합니다' },
        { status: 400 }
      )
    }

    // 현재 사용자 정보 조회
    const { data: userData, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('password_hash')
      .eq('id', user.id)
      .single()

    if (fetchError || !userData) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // 현재 비밀번호 확인
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      userData.password_hash
    )

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '현재 비밀번호가 일치하지 않습니다' },
        { status: 400 }
      )
    }

    // 새 비밀번호 해싱
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // 비밀번호 업데이트
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('id', user.id)

    if (updateError) {
      console.error('[Password] Update error:', updateError)
      return NextResponse.json(
        { error: '비밀번호 변경에 실패했습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Password] Error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
