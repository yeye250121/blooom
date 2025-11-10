import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function POST(request: NextRequest) {
  try {
    const { loginId, password } = await request.json()

    if (!loginId || !password) {
      return NextResponse.json(
        { message: '로그인 ID와 비밀번호를 입력해주세요' },
        { status: 400 }
      )
    }

    // 사용자 조회
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('login_id', loginId)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { message: '아이디 또는 비밀번호가 일치하지 않습니다' },
        { status: 401 }
      )
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: '아이디 또는 비밀번호가 일치하지 않습니다' },
        { status: 401 }
      )
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        id: user.id,
        loginId: user.login_id,
        level: user.level,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 사용자 정보 (비밀번호 제외)
    const marketer = {
      id: user.id,
      loginId: user.login_id,
      nickname: user.nickname,
      uniqueCode: user.unique_code,
      level: user.level,
    }

    return NextResponse.json({
      access_token: token,
      marketer,
    })
  } catch (error) {
    console.error('로그인 오류:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
