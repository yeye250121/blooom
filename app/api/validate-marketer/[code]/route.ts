import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code.toUpperCase()

    // 마케터 코드가 존재하는지 확인
    const { data, error } = await supabase
      .from('users')
      .select('unique_code, nickname')
      .eq('unique_code', code)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { valid: false, message: '유효하지 않은 마케터 코드입니다' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      valid: true,
      marketer: {
        code: data.unique_code,
        nickname: data.nickname,
      },
    })
  } catch (error) {
    console.error('마케터 코드 검증 오류:', error)
    return NextResponse.json(
      { valid: false, message: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
