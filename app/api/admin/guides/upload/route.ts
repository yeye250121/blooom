import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminAuth } from '@/lib/admin/auth'

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '파일을 선택해주세요' },
        { status: 400 }
      )
    }

    // Generate unique file path
    const fileExtension = file.name.split('.').pop()
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const filePath = `images/${timestamp}-${randomString}.${fileExtension}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    console.log('[Guide Upload] Uploading to:', filePath)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('guides')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('[Guide Upload] Storage error:', uploadError)
      throw uploadError
    }
    console.log('[Guide Upload] Upload success:', uploadData)

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('guides')
      .getPublicUrl(filePath)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error('Upload image error:', error)
    return NextResponse.json(
      { error: '업로드에 실패했습니다' },
      { status: 500 }
    )
  }
}
