import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminAuth } from '@/lib/admin/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { id } = await params
    const settlementId = parseInt(id)

    // Get settlement info
    const { data: settlement, error: fetchError } = await supabaseAdmin
      .from('settlements')
      .select('file_path, file_name')
      .eq('id', settlementId)
      .single()

    if (fetchError || !settlement) {
      return NextResponse.json(
        { error: '정산서를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // Download from storage
    const { data, error: downloadError } = await supabaseAdmin.storage
      .from('settlements')
      .download(settlement.file_path)

    if (downloadError || !data) {
      throw downloadError || new Error('Download failed')
    }

    // Convert to buffer
    const arrayBuffer = await data.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(settlement.file_name)}"`,
      },
    })
  } catch (error) {
    console.error('Download settlement error:', error)
    return NextResponse.json(
      { error: '다운로드에 실패했습니다' },
      { status: 500 }
    )
  }
}
