import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAdminContext } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
  const admin = getAdminContext(request)
  if (!admin) {
    return NextResponse.json({ message: '관리자 인증이 필요합니다' }, { status: 401 })
  }

  // 중요: 요청이 올 때마다 매번 새로운 클라이언트를 생성합니다. (런타임 환경변수 로딩 보장)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: { 'Cache-Control': 'no-store' },
    },
  })

  try {
    // 각각의 select 호출은 다른 창고에서 재고표를 가져오는 것과 같으므로 순서대로 수행해도 충분합니다.
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, login_id, nickname, unique_code, referrer_code, level, created_at')
      .order('created_at', { ascending: false })

    if (usersError) {
      throw usersError
    }

    const { data: inquiries, error: inquiriesError } = await supabaseAdmin
      .from('inquiries')
      .select('id, phone_number, install_location, install_count, marketer_code, submitted_at')
      .order('submitted_at', { ascending: false })

    if (inquiriesError) {
      throw inquiriesError
    }

    const { data: guides, error: guidesError } = await supabaseAdmin
      .from('partner_guides')
      .select('id, title, category, content, resource_url, resource_type, display_order, is_active')
      .order('display_order', { ascending: true })

    if (guidesError) {
      throw guidesError
    }

    return NextResponse.json({
      users: users || [],
      inquiries: inquiries || [],
      guides: guides || [],
      debug: {
        envUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        // 범인 찾기: 가져온 데이터들의 ID와 날짜를 모두 기록합니다.
        inquiryIds: inquiries?.map(i => ({ id: i.id.substring(0, 8), date: i.submitted_at })),
        usersCount: users?.length,
        inquiriesCount: inquiries?.length,
        timestamp: new Date().toISOString(),
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    return NextResponse.json(
      { message: '관리자 데이터를 불러오지 못했습니다', details: String(error) },
      { status: 500 }
    )
  }
}

