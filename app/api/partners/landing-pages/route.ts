import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getUserContext } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * 파트너가 사용 가능한 랜딩페이지 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserContext(request)

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    // 파트너에게 할당된 랜딩페이지 조회
    const { data: partnerLandingPages, error: partnerError } = await supabaseAdmin
      .from('partner_landing_pages')
      .select(`
        id,
        is_enabled,
        landing_page:landing_pages (
          id,
          template,
          subtype,
          name,
          description,
          thumbnail_url,
          is_active,
          display_order
        )
      `)
      .eq('partner_id', user.id)
      .eq('is_enabled', true)

    if (partnerError) {
      console.error('[LandingPages] Partner pages error:', partnerError)
      return NextResponse.json(
        { error: '랜딩페이지 조회에 실패했습니다' },
        { status: 500 }
      )
    }

    // 파트너에게 할당된 페이지가 없으면 모든 활성 랜딩페이지 조회
    if (!partnerLandingPages || partnerLandingPages.length === 0) {
      const { data: allLandingPages, error: allError } = await supabaseAdmin
        .from('landing_pages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (allError) {
        console.error('[LandingPages] All pages error:', allError)
        return NextResponse.json(
          { error: '랜딩페이지 조회에 실패했습니다' },
          { status: 500 }
        )
      }

      // 파트너 코드 가져오기
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('unique_code')
        .eq('id', user.id)
        .single()

      const partnerCode = userData?.unique_code || ''

      return NextResponse.json({
        landingPages: allLandingPages?.map(page => ({
          id: page.id,
          template: page.template,
          subtype: page.subtype,
          name: page.name,
          description: page.description,
          thumbnailUrl: page.thumbnail_url,
          url: `/${partnerCode}/${page.template}/${page.subtype}`,
        })) || [],
      })
    }

    // 파트너 코드 가져오기
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('unique_code')
      .eq('id', user.id)
      .single()

    const partnerCode = userData?.unique_code || ''

    // 할당된 랜딩페이지 중 활성화된 것만 반환
    const landingPages = partnerLandingPages
      .filter(plp => plp.landing_page && (plp.landing_page as any).is_active)
      .map(plp => {
        const page = plp.landing_page as any
        return {
          id: page.id,
          template: page.template,
          subtype: page.subtype,
          name: page.name,
          description: page.description,
          thumbnailUrl: page.thumbnail_url,
          url: `/${partnerCode}/${page.template}/${page.subtype}`,
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({ landingPages })
  } catch (error) {
    console.error('[LandingPages] Error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
