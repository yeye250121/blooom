import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function GET() {
  try {
    // 가이드를 정렬해서 가져오는 과정은 책장에 있는 자료집을 순서대로 꺼내오는 것과 같습니다.
    const { data, error } = await supabaseAdmin
      .from('partner_guides')
      .select('id, title, category, content, resource_url, resource_type, display_order, updated_at')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('updated_at', { ascending: false })

    if (error) {
      return NextResponse.json({ message: '가이드 데이터를 불러오지 못했습니다' }, { status: 500 })
    }

    return NextResponse.json({ guides: data || [] })
  } catch (error) {
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다', details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
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

    // S 코드 유저만 가이드 작성 가능
    if (!decoded.uniqueCode || !decoded.uniqueCode.startsWith('S')) {
      return NextResponse.json(
        { message: 'S 코드 계정만 가이드를 작성할 수 있습니다' },
        { status: 403 }
      )
    }

    // 요청 데이터
    const body = await request.json()
    console.log('[가이드 생성] 요청 데이터:', body)

    const { title, category, content, resourceUrl } = body

    if (!title || !category || !content) {
      console.log('[가이드 생성] 필수 필드 누락:', { title, category, content })
      return NextResponse.json(
        { message: '제목, 카테고리, 내용은 필수입니다' },
        { status: 400 }
      )
    }

    // 현재 최대 display_order 조회
    console.log('[가이드 생성] display_order 조회 시작')
    const { data: maxOrderData, error: maxOrderError } = await supabaseAdmin
      .from('partner_guides')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)

    if (maxOrderError) {
      console.error('[가이드 생성] display_order 조회 오류:', maxOrderError)
    }

    const nextOrder = (maxOrderData?.[0]?.display_order || 0) + 1
    console.log('[가이드 생성] 다음 display_order:', nextOrder)

    // 가이드 생성
    const insertData = {
      title,
      category,
      content,
      resource_url: resourceUrl || null,
      resource_type: resourceUrl ? 'url' : 'text',
      display_order: nextOrder,
      is_active: true,
    }
    console.log('[가이드 생성] 삽입할 데이터:', insertData)

    const { data, error } = await supabaseAdmin
      .from('partner_guides')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('[가이드 생성] DB 삽입 오류:', error)
      console.error('[가이드 생성] 에러 상세:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { message: '가이드 생성에 실패했습니다', error: error.message },
        { status: 500 }
      )
    }

    console.log('[가이드 생성] 성공:', data)

    return NextResponse.json({
      message: '가이드가 생성되었습니다',
      guide: data,
    })
  } catch (error) {
    console.error('가이드 생성 오류:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

