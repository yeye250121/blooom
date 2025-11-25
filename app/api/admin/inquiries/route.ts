import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminAuth } from '@/lib/admin/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('[Inquiries API] Starting request')
    const admin = await verifyAdminAuth(request)
    console.log('[Inquiries API] Admin auth result:', admin)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    console.log('[Inquiries API] Status filter:', status)

    // Build query
    let query = supabaseAdmin
      .from('inquiries')
      .select('id, phone_number, install_location, install_count, marketer_code, status, submitted_at, created_at')
      .order('submitted_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: inquiries, error } = await query
    console.log('[Inquiries API] Query result:', { count: inquiries?.length, error })

    if (error) {
      console.error('[Inquiries API] Query error:', error)
      throw error
    }

    // Get marketer info for each inquiry
    const marketerCodes = [...new Set((inquiries || []).map((i) => i.marketer_code))]
    console.log('[Inquiries API] Marketer codes:', marketerCodes)
    const { data: marketers } = await supabaseAdmin
      .from('users')
      .select('unique_code, nickname')
      .in('unique_code', marketerCodes)

    const marketerMap = new Map(
      (marketers || []).map((m) => [m.unique_code, m.nickname])
    )

    const inquiriesWithMarketer = (inquiries || []).map((inquiry) => ({
      id: inquiry.id,
      phone: inquiry.phone_number,
      installLocation: inquiry.install_location,
      installCount: inquiry.install_count,
      marketerCode: inquiry.marketer_code,
      marketerNickname: marketerMap.get(inquiry.marketer_code) || '-',
      status: inquiry.status || 'new',
      submittedAt: inquiry.submitted_at,
    }))

    return NextResponse.json({ inquiries: inquiriesWithMarketer })
  } catch (error) {
    console.error('Inquiries list error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
