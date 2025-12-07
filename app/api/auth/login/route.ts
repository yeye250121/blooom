import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { loginId, password, rememberMe } = await request.json()

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
    }, rememberMe)

    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        loginId: user.login_id,
        nickname: user.nickname,
        uniqueCode: user.unique_code,
        level: user.level,
      },
    })

    // 쿠키에 토큰 저장 (미들웨어에서 인증 체크용)
    // rememberMe: 체크 시 30일, 미체크 시 세션 쿠키 (브라우저 종료 시 삭제)
    const cookieOptions: {
      httpOnly: boolean
      secure: boolean
      sameSite: 'lax'
      path: string
      maxAge?: number
    } = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    }

    if (rememberMe) {
      cookieOptions.maxAge = 60 * 60 * 24 * 30 // 30일
    }

    response.cookies.set('partner-token', token, cookieOptions)

    return response
  } catch (error) {
    console.error('[Login] Error:', error)
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
