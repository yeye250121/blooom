import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminAuth } from '@/lib/admin/auth'
import bcrypt from 'bcryptjs'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { id } = await params
    const partnerId = id
    const { password, nickname, referrerCode, phone } = await request.json()

    if (!nickname) {
      return NextResponse.json(
        { error: '닉네임을 입력해주세요' },
        { status: 400 }
      )
    }

    // Build update object
    const updateData: any = {
      nickname,
      referrer_code: referrerCode || null,
      phone: phone || null,
    }

    // Hash and update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', partnerId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update partner error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { id } = await params
    const partnerId = id

    // Check if partner exists and is not an admin
    const { data: partner } = await supabaseAdmin
      .from('users')
      .select('unique_code')
      .eq('id', partnerId)
      .single()

    if (!partner) {
      return NextResponse.json(
        { error: '파트너를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    if (partner.unique_code.startsWith('S')) {
      return NextResponse.json(
        { error: '관리자는 삭제할 수 없습니다' },
        { status: 403 }
      )
    }

    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', partnerId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete partner error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
