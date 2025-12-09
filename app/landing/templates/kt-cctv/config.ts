/**
 * KT CCTV 랜딩페이지 설정
 */
export const config = {
  // 메타 정보
  meta: {
    title: 'KT 텔레캅 CCTV',
    description: 'KT 텔레캅 CCTV 설치 상담 및 예약',
  },

  // 추적 설정
  tracking: {
    kakaoPixelId: '4341098074617891089',
  },

  // 히어로 이미지
  heroImage: {
    src: 'https://hvwgs4k77hcs8ntu.public.blob.vercel-storage.com/%5B%EC%B5%9C%EC%A2%85%5D%20-%20%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%80%20%2818%29.jpg',
    alt: 'KT 텔레캅',
  },

  // 폼 설정
  form: {
    showInstallation: true,  // 설치예약 탭 표시
    showConsultation: true,  // 상담신청 탭 표시
    defaultTab: 'installation' as const,
  },

  // subtype별 설정 오버라이드
  subtypes: {
    '1': {
      // 기본형: 설치예약 + 상담
      form: {
        showInstallation: true,
        showConsultation: true,
        defaultTab: 'installation' as const,
      },
    },
    '2': {
      // 상담 전용형
      form: {
        showInstallation: false,
        showConsultation: true,
        defaultTab: 'consultation' as const,
      },
    },
    'event': {
      // 이벤트/프로모션용
      form: {
        showInstallation: true,
        showConsultation: true,
        defaultTab: 'installation' as const,
      },
    },
  },
};

export type KtCctvConfig = typeof config;
export type KtCctvSubtype = keyof typeof config.subtypes;
