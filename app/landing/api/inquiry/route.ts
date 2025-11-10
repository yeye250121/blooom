import { NextRequest, NextResponse } from 'next/server';
import { inquiryRequestSchema } from '@/app/landing/lib/validations';
import { appendInquiryToSheet } from '@/app/landing/lib/google-sheets';
import { sendSlackNotification } from '@/app/landing/lib/slack';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = inquiryRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: '입력 데이터가 유효하지 않습니다',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // Supabase에 저장
    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          referrer_url: validationResult.data.referrerUrl || null,
          phone_number: validationResult.data.phoneNumber,
          install_location: validationResult.data.installLocation,
          install_count: validationResult.data.installCount,
          privacy_consent: validationResult.data.privacyConsent,
          submitted_at: validationResult.data.submittedAt || new Date().toISOString(),
          marketer_code: validationResult.data.marketerCode || null,
        },
      ])
      .select();

    if (error) {
      console.error('❌ Supabase 저장 오류:', error);
      throw new Error('데이터베이스 저장에 실패했습니다');
    }

    // Google Sheets에도 저장 (기존 기능 유지)
    appendInquiryToSheet(validationResult.data).catch((error) => {
      console.error('⚠️ Google Sheets 저장 중 오류 (메인 프로세스는 정상):', error);
    });

    // 🔔 Slack 알림 전송 (비동기, 실패해도 전체 프로세스는 계속 진행)
    sendSlackNotification(validationResult.data).catch((error) => {
      console.error('⚠️ Slack 알림 전송 중 오류 (메인 프로세스는 정상):', error);
    });

    return NextResponse.json(
      {
        success: true,
        message: '문의가 성공적으로 접수되었습니다',
        data: data?.[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ API 오류:', error);

    return NextResponse.json(
      {
        success: false,
        message: '서버 오류가 발생했습니다',
      },
      { status: 500 }
    );
  }
}

// OPTIONS 메서드 지원 (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
