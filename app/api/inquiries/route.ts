import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
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
    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { message: '유효하지 않은 토큰입니다' },
        { status: 401 }
      )
    }

    // 사용자 정보 가져오기 (토큰에서 추출한 정보로)
    const decoded: any = jwt.verify(token, JWT_SECRET)

    // 사용자의 마케터 코드 가져오기
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('unique_code')
      .eq('id', decoded.id)
      .single()

    if (!user) {
      return NextResponse.json(
        { message: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    console.log('User unique_code:', user.unique_code)

    // URL 쿼리 파라미터
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // 먼저 모든 문의의 marketer_code 확인 (디버깅)
    const { data: allInquiries } = await supabaseAdmin
      .from('inquiries')
      .select('id, marketer_code')
      .limit(5)

    console.log('Sample marketer_codes from DB:', allInquiries?.map(i => `"${i.marketer_code}"`))
    console.log('Comparing with user code:', `"${user.unique_code}"`)

    // 문의 목록 조회 (본인의 마케터 코드로 필터링)
    const { data: inquiries, error, count } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact' })
      .eq('marketer_code', user.unique_code)
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1)

    console.log('Filtered query result:', { count, inquiriesLength: inquiries?.length })

    if (error) {
      console.error('문의 조회 오류:', error)
      return NextResponse.json(
        { message: '문의 조회에 실패했습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      inquiries: inquiries || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('문의 조회 오류:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
