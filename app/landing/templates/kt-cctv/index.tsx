'use client';

import Script from 'next/script';
import ReservationForm from '@/app/landing/components/ReservationForm';
import HowToParticipate from '@/app/landing/components/HowToParticipate';
import SpecialBenefits from '@/app/landing/components/SpecialBenefits';
import Hero from '@/app/landing/components/Hero';
import Features from '@/app/landing/components/Features';
import Footer from '@/app/landing/components/Footer';

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
  // subtype에 따른 분기 (추후 확장)
  // 현재는 모든 subtype이 동일한 UI 사용

  return (
    <>
      {/* Kakao Pixel */}
      <Script
        id="kakao-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            kakaoPixel('4341098074617891089').pageView();
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
            src="https://hvwgs4k77hcs8ntu.public.blob.vercel-storage.com/%5B%EC%B5%9C%EC%A2%85%5D%20-%20%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%80%20%2818%29.jpg"
            alt="KT 텔레캅"
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
