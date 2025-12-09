'use client';

import Script from 'next/script';
import {
  ReservationForm,
  HowToParticipate,
  SpecialBenefits,
  Hero,
  Features,
  Footer,
} from '@/app/landing/components';
import { config, KtCctvSubtype } from './config';

interface KtCctvLandingProps {
  marketerCode: string;
  template: string;
  subtype: string;
}

/**
 * KT CCTV 랜딩페이지 템플릿
 *
 * subtype에 따라 다른 버전 표시 가능:
 * - 1: 기본형 (설치예약 + 상담)
 * - 2: 상담 전용형
 * - event: 이벤트/프로모션용
 */
export default function KtCctvLanding({ marketerCode, template, subtype }: KtCctvLandingProps) {
  // subtype별 설정 가져오기 (없으면 기본값 '1' 사용)
  const subtypeConfig = config.subtypes[subtype as KtCctvSubtype] || config.subtypes['1'];

  return (
    <>
      {/* Kakao Pixel */}
      <Script
        id="kakao-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            kakaoPixel('${config.tracking.kakaoPixelId}').pageView();
          `,
        }}
      />

      {/* Config Script */}
      <Script src="/config.js" strategy="beforeInteractive" />

      <main>
        <ReservationForm
          marketerCode={marketerCode}
          landingTemplate={template}
          landingSubtype={subtype}
        />
        <section className="hero-image">
          <img
            src={config.heroImage.src}
            alt={config.heroImage.alt}
          />
        </section>
        <HowToParticipate />
        <SpecialBenefits />
        <Hero />
        <Features />
        <Footer />
      </main>
    </>
  );
}
