import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserContext } from '@/lib/auth'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const user = getUserContext(request)
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    // Get settlements for the current user
    const { data: settlements, error } = await supabaseAdmin
      .from('settlements')
      .select('id, partner_code, settlement_date, file_name, file_path, created_at')
      .eq('partner_code', user.uniqueCode)
      .order('settlement_date', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      settlements: (settlements || []).map((settlement) => ({
        id: settlement.id,
        settlementDate: settlement.settlement_date,
        fileName: settlement.file_name,
        createdAt: settlement.created_at,
      })),
    })
  } catch (error) {
    console.error('Settlements list error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
