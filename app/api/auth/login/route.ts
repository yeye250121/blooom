import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { loginId, password } = await request.json()

    if (!loginId || !password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 입력해주세요' },
        { status: 400 }
      )
    }

    // 사용자 조회
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('login_id', loginId)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 일치하지 않습니다' },
        { status: 401 }
      )
    }

    // 비밀번호 검증
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 일치하지 않습니다' },
        { status: 401 }
      )
    }

    // JWT 토큰 생성
    const token = generateToken({
      id: user.id,
      loginId: user.login_id,
      uniqueCode: user.unique_code,
      nickname: user.nickname || '',
      level: user.level || 1,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        loginId: user.login_id,
        nickname: user.nickname,
        uniqueCode: user.unique_code,
        level: user.level,
      },
    })
  } catch (error) {
    console.error('[Login] Error:', error)
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
