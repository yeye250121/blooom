import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getUserContext } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * 하위 파트너 목록 + 각 파트너별 문의 수 조회
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserContext(request)

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    // 직속 + 전체 하위 파트너 조회 (재귀)
    const subordinates = await getSubordinatesWithStats(user.uniqueCode)

    return NextResponse.json({
      data: subordinates,
      total: subordinates.length,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('[Subordinates] Error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

interface SubordinateInfo {
  uniqueCode: string
  nickname: string
  level: number
  createdAt: string
  inquiryCount: number
}

async function getSubordinatesWithStats(rootCode: string): Promise<SubordinateInfo[]> {
  // 하위 파트너 코드 목록 조회 (BFS)
  const subordinateCodes: string[] = []
  const queue = [rootCode]

  while (queue.length > 0) {
    const currentCode = queue.shift()!

    const { data: children } = await supabaseAdmin
      .from('users')
      .select('unique_code')
      .eq('referrer_code', currentCode)

    if (children && children.length > 0) {
      for (const child of children) {
        subordinateCodes.push(child.unique_code)
        queue.push(child.unique_code)
      }
    }
  }

  if (subordinateCodes.length === 0) {
    return []
  }

  // 하위 파트너 상세 정보 조회
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('unique_code, nickname, level, created_at')
    .in('unique_code', subordinateCodes)

  if (!users) {
    return []
  }

  // 각 파트너별 문의 수 조회
  const result: SubordinateInfo[] = []

  for (const u of users) {
    const { count } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('marketer_code', u.unique_code)

    result.push({
      uniqueCode: u.unique_code,
      nickname: u.nickname || '',
      level: u.level || 1,
      createdAt: u.created_at,
      inquiryCount: count || 0,
    })
  }

  return result
}
