import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * GET /api/reservation/lookup?phone=01012345678
 * 전화번호로 최근 문의 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json(
        { success: false, message: '전화번호를 입력해주세요' },
        { status: 400 }
      );
    }

    // 전화번호 정규화 (숫자만)
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // 전화번호 형식 검증
    if (!/^01[0-9]{8,9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: '올바른 전화번호 형식이 아닙니다' },
        { status: 400 }
      );
    }

    // 가장 최근 문의 조회 (예약 완료되지 않은 것 우선)
    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .select('id, phone_number, status, created_at, documents_submitted')
      .eq('phone_number', cleanPhone)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !inquiry) {
      return NextResponse.json(
        { success: false, message: '해당 전화번호로 접수된 문의가 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry: {
        id: inquiry.id,
        status: inquiry.status,
        documentsSubmitted: inquiry.documents_submitted,
      },
    });
  } catch (error) {
    console.error('GET /api/reservation/lookup error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
