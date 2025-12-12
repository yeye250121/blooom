import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/reservation/[id]
 * 문의 정보 조회
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 ID입니다' },
        { status: 400 }
      );
    }

    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !inquiry) {
      return NextResponse.json(
        { success: false, message: '문의 정보를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    console.error('GET /api/reservation/[id] error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/reservation/[id]
 * 예약 정보 업데이트
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 ID입니다' },
        { status: 400 }
      );
    }

    // 기존 문의 확인
    const { data: existingInquiry, error: fetchError } = await supabaseAdmin
      .from('inquiries')
      .select('id, documents_submitted, status')
      .eq('id', id)
      .single();

    if (fetchError || !existingInquiry) {
      return NextResponse.json(
        { success: false, message: '문의 정보를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 이미 예약 완료된 경우
    if (existingInquiry.status === 'reservation_complete') {
      return NextResponse.json(
        { success: false, message: '이미 예약이 완료된 문의입니다' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // 업데이트할 데이터 구성
    const updateData: Record<string, unknown> = {
      inquiry_type: 'installation', // 예약 정보 등록 시 설치 예약으로 변경
    };

    if (body.reservationDate) {
      updateData.reservation_date = body.reservationDate;
    }
    if (body.reservationTimeSlot) {
      updateData.reservation_time_slot = body.reservationTimeSlot;
    }
    if (typeof body.outdoorCount === 'number') {
      updateData.outdoor_count = body.outdoorCount;
    }
    if (typeof body.indoorCount === 'number') {
      updateData.indoor_count = body.indoorCount;
    }
    if (body.address) {
      updateData.address = body.address;
      updateData.install_location = body.address; // 하위 호환성
    }
    if (body.addressDetail !== undefined) {
      updateData.address_detail = body.addressDetail;
    }
    if (body.zonecode) {
      updateData.zonecode = body.zonecode;
    }
    if (body.documents) {
      // 기존 documents와 병합
      const { data: currentData } = await supabaseAdmin
        .from('inquiries')
        .select('documents')
        .eq('id', id)
        .single();

      updateData.documents = {
        ...(currentData?.documents || {}),
        ...body.documents,
      };
    }
    if (typeof body.documentsSubmitted === 'boolean') {
      updateData.documents_submitted = body.documentsSubmitted;
    }

    // install_count 계산
    if (typeof body.outdoorCount === 'number' || typeof body.indoorCount === 'number') {
      const outdoorCount = body.outdoorCount ?? 0;
      const indoorCount = body.indoorCount ?? 0;
      updateData.install_count = outdoorCount + indoorCount;
    }

    // 상태 업데이트
    if (body.documentsSubmitted) {
      updateData.status = 'documents_submitted';
    } else if (body.reservationDate) {
      updateData.status = 'scheduled'; // 예약 일정 등록됨
    }

    const { data: updatedInquiry, error: updateError } = await supabaseAdmin
      .from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { success: false, message: '업데이트에 실패했습니다' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '예약 정보가 저장되었습니다',
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error('PATCH /api/reservation/[id] error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
