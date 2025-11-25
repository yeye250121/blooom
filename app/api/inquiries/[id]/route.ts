import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getUserContext } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * 문의 상태 수정
 * - 본인의 marketer_code와 일치하는 문의만 수정 가능
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserContext(request)

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { id } = params
    const { status } = await request.json()

    // 유효한 상태 값 검증
    const validStatuses = ['new', 'in_progress', 'contracted', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태 값입니다' },
        { status: 400 }
      )
    }

    // 문의 조회
    const { data: inquiry, error: fetchError } = await supabaseAdmin
      .from('inquiries')
      .select('marketer_code')
      .eq('id', id)
      .single()

    if (fetchError || !inquiry) {
      return NextResponse.json(
        { error: '문의를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // 권한 확인: 본인의 문의만 수정 가능
    if (inquiry.marketer_code !== user.uniqueCode) {
      return NextResponse.json(
        { error: '본인의 문의만 수정할 수 있습니다' },
        { status: 403 }
      )
    }

    // 상태 업데이트
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Inquiry Update] Error:', error)
      return NextResponse.json(
        { error: '상태 업데이트 실패' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        canEdit: true,
      },
    })
  } catch (error) {
    console.error('[Inquiry Update] Error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
