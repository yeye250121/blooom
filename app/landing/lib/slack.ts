import type { InquiryRequest, ExtendedInquiryRequest } from '@/app/landing/types/inquiry';

/**
 * Slack 웹훅 알림 전송
 *
 * 비유: 택배 기사님이 문 앞에 도착하면 초인종을 누르는 것처럼,
 * 새로운 상담 신청이 들어오면 Slack으로 알림을 보냅니다.
 */

type SlackData = InquiryRequest | ExtendedInquiryRequest;

// Slack 메시지 포맷 생성
function formatSlackMessage(data: SlackData): object {
  const phoneNumber = data.phoneNumber;
  
  return {
    // 메시지 본문 (간단한 텍스트)
    text: '새로운 KT CCTV 상담 신청이 접수되었습니다!',
    
    // 블록 레이아웃 (예쁜 포맷)
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '새로운 상담 신청',
          emoji: false,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*전화번호:*\n${phoneNumber}`,
          },
          {
            type: 'mrkdwn',
            text: `*설치 지역:*\n${data.installLocation}`,
          },
          {
            type: 'mrkdwn',
            text: `*설치 대수:*\n${data.installCount}대`,
          },
          {
            type: 'mrkdwn',
            text: `*유입 경로:*\n${data.referrerUrl || '직접 접속'}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `접수 시간: ${new Date().toLocaleString('ko-KR', { 
              timeZone: 'Asia/Seoul',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Google Sheets에서 보기',
              emoji: false,
            },
            url: `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SPREADSHEET_ID}`,
            style: 'primary',
          },
        ],
      },
    ],
  };
}

/**
 * Slack으로 알림 전송
 *
 * @param data - 상담 신청 데이터
 * @returns 성공 여부
 */
export async function sendSlackNotification(data: SlackData): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  // Slack 웹훅 URL이 설정되지 않은 경우 스킵
  if (!webhookUrl) {
    console.log('ℹ️ Slack 웹훅 URL이 설정되지 않았습니다. 알림을 건너뜁니다.');
    return true; // 에러는 아니므로 true 반환
  }

  try {
    const message = formatSlackMessage(data);

    // Slack 웹훅으로 POST 요청
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Slack API 오류: ${response.status} ${response.statusText}`);
    }

    console.log('✅ Slack 알림 전송 완료:', data.phoneNumber);
    return true;
  } catch (error) {
    // 알림 실패해도 전체 프로세스는 중단하지 않음
    console.error('❌ Slack 알림 전송 실패:', error);
    return false;
  }
}

