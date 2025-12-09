'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import {
  ReservationForm,
  HowToParticipate,
  SpecialBenefits,
  Hero,
  Features,
  Footer,
  PartnersHero,
  PartnersBenefits,
  PartnersSupport,
  PartnersCTA,
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
 * - 2: 파트너 스타일형 (블룸 파트너스 디자인)
 * - event: 이벤트/프로모션용
 */
export default function KtCctvLanding({ marketerCode, template, subtype }: KtCctvLandingProps) {
  // subtype별 설정 가져오기 (없으면 기본값 '1' 사용)
  const subtypeConfig = config.subtypes[subtype as KtCctvSubtype] || config.subtypes['1'];
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for fade-in animations (subtype 2용)
  useEffect(() => {
    if (subtype !== '2') return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.classList.remove('opacity-0', 'translate-y-12');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [subtype]);

  // subtype 2: 파트너스 스타일 랜딩
  if (subtype === '2') {
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

        <div className="min-h-screen bg-white">
          <PartnersHero />
          <PartnersBenefits />
          <PartnersSupport />
          <PartnersCTA />
          <Footer />
        </div>

        <style jsx global>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(48px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.7s ease-out forwards;
          }
        `}</style>
      </>
    );
  }

  // 기본 레이아웃 (subtype 1, event 등)
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
