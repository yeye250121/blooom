import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminAuth } from '@/lib/admin/auth'

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { data: settlements, error } = await supabaseAdmin
      .from('settlements')
      .select('*')
      .order('settlement_date', { ascending: false })
      .order('partner_code', { ascending: true })

    if (error) {
      throw error
    }

    // Get partner info
    const partnerCodes = [...new Set((settlements || []).map((s) => s.partner_code))]
    const { data: partners } = await supabaseAdmin
      .from('users')
      .select('unique_code, nickname')
      .in('unique_code', partnerCodes)

    const partnerMap = new Map(
      (partners || []).map((p) => [p.unique_code, p.nickname])
    )

    const settlementsWithPartner = (settlements || []).map((settlement) => ({
      id: settlement.id,
      partnerCode: settlement.partner_code,
      partnerNickname: partnerMap.get(settlement.partner_code) || '-',
      settlementDate: settlement.settlement_date,
      fileName: settlement.file_name,
      filePath: settlement.file_path,
      createdAt: settlement.created_at,
    }))

    return NextResponse.json({ settlements: settlementsWithPartner })
  } catch (error) {
    console.error('Settlements list error:', error)
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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const partnerCode = formData.get('partnerCode') as string
    const settlementDate = formData.get('settlementDate') as string

    if (!file || !partnerCode || !settlementDate) {
      return NextResponse.json(
        { error: '모든 항목을 입력해주세요' },
        { status: 400 }
      )
    }

    // Check if settlement already exists for this partner/date
    const { data: existing } = await supabaseAdmin
      .from('settlements')
      .select('id, file_path')
      .eq('partner_code', partnerCode)
      .eq('settlement_date', settlementDate)
      .single()

    // If exists, delete old file
    if (existing) {
      await supabaseAdmin.storage
        .from('settlements')
        .remove([existing.file_path])
    }

    // Generate unique file path
    const fileExtension = file.name.split('.').pop()
    const filePath = `${partnerCode}/${settlementDate}.${fileExtension}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('settlements')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      throw uploadError
    }

    // Save or update record in database
    if (existing) {
      await supabaseAdmin
        .from('settlements')
        .update({
          file_path: filePath,
          file_name: file.name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
    } else {
      await supabaseAdmin.from('settlements').insert({
        partner_code: partnerCode,
        settlement_date: settlementDate,
        file_path: filePath,
        file_name: file.name,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Upload settlement error:', error)
    return NextResponse.json(
      { error: '업로드에 실패했습니다' },
      { status: 500 }
    )
  }
}
