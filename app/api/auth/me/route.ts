import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: '인증 토큰이 필요합니다' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // JWT 토큰 검증
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { message: '유효하지 않은 토큰입니다' },
        { status: 401 }
      )
    }

    // 사용자 조회
    const { data: user, error } = await supabase
      .from('users')
      .select('id, login_id, nickname, unique_code, level, created_at')
      .eq('id', decoded.id)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { message: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      loginId: user.login_id,
      nickname: user.nickname,
      uniqueCode: user.unique_code,
      level: user.level,
      createdAt: user.created_at,
    })
  } catch (error) {
    console.error('사용자 조회 오류:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
