import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminAuth } from '@/lib/admin/auth'

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    // Get total partners count (excluding S codes)
    const { count: totalPartners } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .not('unique_code', 'like', 'S%')

    // Get total inquiries count
    const { count: totalInquiries } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true })

    // Get new inquiries count
    const { count: newInquiries } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')

    // Get contracted inquiries count
    const { count: contractedInquiries } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'contracted')

    // Get recent inquiries
    const { data: recentInquiries } = await supabaseAdmin
      .from('inquiries')
      .select('id, name, phone, marketer_code, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      totalPartners: totalPartners || 0,
      totalInquiries: totalInquiries || 0,
      newInquiries: newInquiries || 0,
      contractedInquiries: contractedInquiries || 0,
      recentInquiries: (recentInquiries || []).map((inquiry) => ({
        id: inquiry.id,
        name: inquiry.name,
        phone: inquiry.phone,
        marketerCode: inquiry.marketer_code,
        status: inquiry.status || 'new',
        createdAt: inquiry.created_at,
      })),
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
