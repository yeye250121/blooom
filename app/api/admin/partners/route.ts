import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminAuth } from '@/lib/admin/auth'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    // Get all users
    const { data: partners, error } = await supabaseAdmin
      .from('users')
      .select('id, login_id, nickname, unique_code, level, created_at, phone, bank_name, account_number, account_holder')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Get inquiry counts for each partner
    const partnersWithCounts = await Promise.all(
      (partners || []).map(async (partner) => {
        const { count } = await supabaseAdmin
          .from('inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('marketer_code', partner.unique_code)

        return {
          id: partner.id,
          loginId: partner.login_id,
          nickname: partner.nickname,
          uniqueCode: partner.unique_code,
          level: partner.level,
          createdAt: partner.created_at,
          inquiryCount: count || 0,
          phone: partner.phone,
          bankName: partner.bank_name,
          accountNumber: partner.account_number,
          accountHolder: partner.account_holder,
        }
      })
    )

    return NextResponse.json({ partners: partnersWithCounts })
  } catch (error) {
    console.error('Partners list error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { loginId, password, nickname, uniqueCode, referrerCode, phone } = await request.json()

    if (!loginId || !password || !nickname || !uniqueCode) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요' },
        { status: 400 }
      )
    }

    // Check for duplicate loginId
    const { data: existingLogin } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('login_id', loginId)
      .single()

    if (existingLogin) {
      return NextResponse.json(
        { error: '이미 사용 중인 아이디입니다' },
        { status: 400 }
      )
    }

    // Check for duplicate uniqueCode
    const { data: existingCode } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('unique_code', uniqueCode)
      .single()

    if (existingCode) {
      return NextResponse.json(
        { error: '이미 사용 중인 코드입니다' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create partner
    const { data: newPartner, error } = await supabaseAdmin
      .from('users')
      .insert({
        login_id: loginId,
        password: hashedPassword,
        nickname,
        unique_code: uniqueCode,
        referrer_code: referrerCode || null,
        phone: phone || null,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      partner: {
        id: newPartner.id,
        loginId: newPartner.login_id,
        nickname: newPartner.nickname,
        uniqueCode: newPartner.unique_code,
        referrerCode: newPartner.referrer_code,
        phone: newPartner.phone,
        createdAt: newPartner.created_at,
      },
    })
  } catch (error) {
    console.error('Create partner error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
