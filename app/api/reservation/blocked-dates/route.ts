import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET: 예약 불가일 목록 조회
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('reservation_blocked_dates')
      .select('blocked_date, is_blocked, reason')
      .order('blocked_date', { ascending: true });

    if (error) {
      console.error('예약 불가일 조회 오류:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      blockedDates: data || [],
    });
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// POST: 예약 불가일 추가/수정 (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blockedDate, isBlocked, reason } = body;

    if (!blockedDate) {
      return NextResponse.json(
        { success: false, message: '날짜를 입력해주세요' },
        { status: 400 }
      );
    }

    // upsert: 이미 있으면 업데이트, 없으면 삽입
    const { data, error } = await supabaseAdmin
      .from('reservation_blocked_dates')
      .upsert(
        {
          blocked_date: blockedDate,
          is_blocked: isBlocked ?? true,
          reason: reason || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'blocked_date' }
      )
      .select();

    if (error) {
      console.error('예약 불가일 저장 오류:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: isBlocked ? '예약 불가일이 설정되었습니다' : '예약 가능일로 변경되었습니다',
      data: data?.[0],
    });
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE: 예약 불가일 삭제 (관리자 전용)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blockedDate = searchParams.get('date');

    if (!blockedDate) {
      return NextResponse.json(
        { success: false, message: '날짜를 입력해주세요' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('reservation_blocked_dates')
      .delete()
      .eq('blocked_date', blockedDate);

    if (error) {
      console.error('예약 불가일 삭제 오류:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: '예약 불가일 설정이 삭제되었습니다',
    });
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
