import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminAuth } from '@/lib/admin/auth'
import { sendPartnerContractSuccessAlimtalk, sendPartnerInquiryCancelledAlimtalk } from '@/lib/alimtalk-service'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { id: inquiryId } = await params
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: '상태를 선택해주세요' },
        { status: 400 }
      )
    }

    const validStatuses = ['new', 'in_progress', 'contracted', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태입니다' },
        { status: 400 }
      )
    }

    // 기존 문의 정보 조회 (파트너 알림톡 발송용)
    const { data: inquiry } = await supabaseAdmin
      .from('inquiries')
      .select('marketer_code, status')
      .eq('id', inquiryId)
      .single()

    const previousStatus = inquiry?.status
    const marketerCode = inquiry?.marketer_code

    const { error } = await supabaseAdmin
      .from('inquiries')
      .update({ status })
      .eq('id', inquiryId)

    if (error) {
      throw error
    }

    // 상태 변경 시 파트너에게 알림톡 발송 (비동기)
    if (marketerCode && previousStatus !== status) {
      (async () => {
        try {
          const { data: partner } = await supabaseAdmin
            .from('users')
            .select('phone')
            .eq('unique_code', marketerCode.toUpperCase())
            .single()

          if (partner?.phone) {
            // 계약 성공 (contracted)
            if (status === 'contracted') {
              await sendPartnerContractSuccessAlimtalk(partner.phone)
            }
            // 상담 취소 (cancelled)
            else if (status === 'cancelled') {
              await sendPartnerInquiryCancelledAlimtalk(partner.phone)
            }
          }
        } catch (err) {
          console.error('알림톡 발송 실패:', err)
        }
      })()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update inquiry error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { id: inquiryId } = await params

    const { error } = await supabaseAdmin
      .from('inquiries')
      .delete()
      .eq('id', inquiryId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete inquiry error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
