import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

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
        { message: '유효하지 않은 토큰입니다', error: String(error) },
        { status: 401 }
      )
    }

    // 사용자 정보 가져오기
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single()

    if (userError || !user) {
      return NextResponse.json({
        error: '사용자 조회 실패',
        details: userError,
        decodedToken: decoded
      })
    }

    // 모든 문의 샘플 가져오기
    const { data: allInquiries, error: allError } = await supabase
      .from('inquiries')
      .select('*')
      .limit(10)

    // 내 문의 가져오기
    const { data: myInquiries, error: myError, count } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact' })
      .eq('marketer_code', user.unique_code)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        login_id: user.login_id,
        unique_code: user.unique_code,
        level: user.level
      },
      allInquiries: {
        count: allInquiries?.length || 0,
        sample: allInquiries?.slice(0, 3).map(i => ({
          id: i.id,
          marketer_code: i.marketer_code,
          phone_number: i.phone_number?.slice(-4) // 마지막 4자리만
        }))
      },
      myInquiries: {
        count: count || 0,
        sample: myInquiries?.slice(0, 3).map(i => ({
          id: i.id,
          marketer_code: i.marketer_code,
          phone_number: i.phone_number?.slice(-4)
        }))
      },
      comparison: {
        userCode: user.unique_code,
        matchingCodes: allInquiries?.filter(i => i.marketer_code === user.unique_code).length || 0
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: '서버 오류',
      details: String(error)
    }, { status: 500 })
  }
}
