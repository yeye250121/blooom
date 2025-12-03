import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getUserContext } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * 프로필 조회
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserContext(request)

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, login_id, nickname, unique_code, level, phone, bank_name, account_number, account_holder')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('[Profile] Get error:', error)
      return NextResponse.json(
        { error: '프로필 조회에 실패했습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      user: {
        id: data.id,
        loginId: data.login_id,
        nickname: data.nickname,
        uniqueCode: data.unique_code,
        level: data.level,
        phone: data.phone,
        bankName: data.bank_name,
        accountNumber: data.account_number,
        accountHolder: data.account_holder,
      },
    })
  } catch (error) {
    console.error('[Profile] Error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

/**
 * 프로필 업데이트 (닉네임, 전화번호, 계좌정보)
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = getUserContext(request)

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { nickname, phone, bankName, accountNumber, accountHolder } = await request.json()

    // 업데이트할 필드만 포함
    const updateData: Record<string, string> = {}

    if (nickname !== undefined) {
      if (typeof nickname !== 'string' || nickname.length < 2 || nickname.length > 20) {
        return NextResponse.json(
          { error: '닉네임은 2~20자 사이여야 합니다' },
          { status: 400 }
        )
      }
      updateData.nickname = nickname.trim()
    }

    if (phone !== undefined) {
      updateData.phone = phone?.trim() || null
    }

    if (bankName !== undefined) {
      updateData.bank_name = bankName?.trim() || null
    }

    if (accountNumber !== undefined) {
      updateData.account_number = accountNumber?.trim() || null
    }

    if (accountHolder !== undefined) {
      updateData.account_holder = accountHolder?.trim() || null
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: '변경할 항목이 없습니다' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select('id, login_id, nickname, unique_code, level, phone, bank_name, account_number, account_holder')
      .single()

    if (error) {
      console.error('[Profile] Update error:', error)
      return NextResponse.json(
        { error: '프로필 변경에 실패했습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        loginId: data.login_id,
        nickname: data.nickname,
        uniqueCode: data.unique_code,
        level: data.level,
        phone: data.phone,
        bankName: data.bank_name,
        accountNumber: data.account_number,
        accountHolder: data.account_holder,
      },
    })
  } catch (error) {
    console.error('[Profile] Error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
