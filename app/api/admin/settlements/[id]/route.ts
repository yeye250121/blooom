import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminAuth } from '@/lib/admin/auth'

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
    const settlementId = parseInt(id)

    // Get settlement info
    const { data: settlement, error: fetchError } = await supabaseAdmin
      .from('settlements')
      .select('file_path')
      .eq('id', settlementId)
      .single()

    if (fetchError || !settlement) {
      return NextResponse.json(
        { error: '정산서를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // Delete from storage
    await supabaseAdmin.storage
      .from('settlements')
      .remove([settlement.file_path])

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('settlements')
      .delete()
      .eq('id', settlementId)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete settlement error:', error)
    return NextResponse.json(
      { error: '삭제에 실패했습니다' },
      { status: 500 }
    )
  }
}
