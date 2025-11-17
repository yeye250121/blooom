import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '@/lib/supabase-admin'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: '인증 토큰이 필요합니다' }, { status: 401 })
    }

    const token = authHeader.slice(7)

    // JWT는 회원카드를 스캔해 신원을 확인하는 장치와 같습니다.
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ message: '유효하지 않은 토큰입니다' }, { status: 401 })
    }

    // 내 고유 코드를 찾는 과정은 사번표에서 내 사번을 다시 확인하는 절차입니다.
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('unique_code')
      .eq('id', decoded.id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ message: '사용자를 찾을 수 없습니다' }, { status: 404 })
    }

    // referrer_code 필터링은 가계도에서 바로 아래 자식을 찾는 것과 동일한 개념입니다.
    const { data: members, error } = await supabaseAdmin
      .from('users')
      .select('id, nickname, unique_code, level, created_at')
      .eq('referrer_code', user.unique_code)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ message: '직속 파트너 조회에 실패했습니다' }, { status: 500 })
    }

    return NextResponse.json({
      members: members || [],
    })
  } catch (error) {
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다', details: String(error) },
      { status: 500 }
    )
  }
}

