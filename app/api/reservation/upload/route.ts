import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: '파일이 없습니다' },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: '파일 크기는 10MB를 초과할 수 없습니다' },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: '지원하지 않는 파일 형식입니다 (JPG, PNG, WebP, PDF만 가능)' },
        { status: 400 }
      );
    }

    // 파일 이름 생성 (유니크하게)
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `${type || 'document'}_${timestamp}_${randomStr}.${extension}`;
    const filePath = `documents/${fileName}`;

    // ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Supabase Storage에 업로드
    const { error: uploadError } = await supabaseAdmin.storage
      .from('inquiry-documents')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('파일 업로드 오류:', uploadError);
      throw uploadError;
    }

    // Signed URL 생성 (7일 유효)
    const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
      .from('inquiry-documents')
      .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7일

    if (urlError) {
      console.error('Signed URL 생성 오류:', urlError);
      throw urlError;
    }

    return NextResponse.json({
      success: true,
      url: signedUrlData.signedUrl,
      path: filePath,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { success: false, message: '파일 업로드에 실패했습니다' },
      { status: 500 }
    );
  }
}
