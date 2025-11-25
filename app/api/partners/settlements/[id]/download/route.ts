import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserContext } from '@/lib/auth'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserContext(request)
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { id } = await params
    const settlementId = parseInt(id)

    // Get settlement info - verify it belongs to the user
    const { data: settlement, error: fetchError } = await supabaseAdmin
      .from('settlements')
      .select('file_path, file_name, partner_code')
      .eq('id', settlementId)
      .single()

    if (fetchError || !settlement) {
      return NextResponse.json(
        { error: '정산서를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // Verify the settlement belongs to the current user
    if (settlement.partner_code !== user.uniqueCode) {
      return NextResponse.json(
        { error: '접근 권한이 없습니다' },
        { status: 403 }
      )
    }

    // Download from storage
    const { data, error: downloadError } = await supabaseAdmin.storage
      .from('settlements')
      .download(settlement.file_path)

    if (downloadError || !data) {
      throw downloadError || new Error('Download failed')
    }

    // Get content type based on file extension
    const extension = settlement.file_name.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    if (extension === 'pdf') {
      contentType = 'application/pdf'
    } else if (extension === 'jpg' || extension === 'jpeg') {
      contentType = 'image/jpeg'
    } else if (extension === 'png') {
      contentType = 'image/png'
    }

    // Convert to buffer
    const arrayBuffer = await data.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
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
