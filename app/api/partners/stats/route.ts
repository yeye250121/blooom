import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getUserContext } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * 본인 + 하위 파트너 전체 문의 통계
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserContext(request)

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    // 본인 + 하위 파트너 코드 조회
    const codes = await getAllSubordinateCodes(user.uniqueCode)

    // 전체 문의 수
    const { count: total } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .in('marketer_code', codes)

    // 상태별 문의 수
    const statuses = ['new', 'in_progress', 'contracted', 'cancelled'] as const

    const statusCounts: Record<string, number> = {}

    for (const status of statuses) {
      const { count } = await supabaseAdmin
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .in('marketer_code', codes)
        .eq('status', status)

      statusCounts[status] = count || 0
    }

    return NextResponse.json({
      total: total || 0,
      byStatus: statusCounts,
    })
  } catch (error) {
    console.error('[Stats] Error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

async function getAllSubordinateCodes(rootCode: string): Promise<string[]> {
  const codes = [rootCode]
  const queue = [rootCode]

  while (queue.length > 0) {
    const currentCode = queue.shift()!

    const { data: children } = await supabaseAdmin
      .from('users')
      .select('unique_code')
      .eq('referrer_code', currentCode)

    if (children && children.length > 0) {
      for (const child of children) {
        codes.push(child.unique_code)
        queue.push(child.unique_code)
      }
    }
  }

  return codes
}
