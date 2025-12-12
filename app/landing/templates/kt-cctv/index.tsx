'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import {
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

// Contact 페이지 URL 생성 헬퍼
const getContactUrl = (marketerCode: string, template: string, subtype: string) =>
  `/${marketerCode}/${template}/contact?from=${subtype}`;

// KT CCTV 랜딩 subtype 2 전용 콘텐츠
const ktCctvContent = {
  hero: {
    title: (
      <>
        해킹 걱정 없이<br />안전하게 지켜요
      </>
    ),
    subtitle: 'KT 텔레캅이 든든하게 막아드릴게요.',
    ctaText: '무료로 상담받기',
    // 네비게이션 숨김 (단일 랜딩 페이지용)
    hideNav: true,
  },
  benefits: {
    sectionTitle: (
      <>
        KT CCTV만의<br />특별한 혜택
      </>
    ),
    benefits: [
      {
        imageSrc: 'https://hvwgs4k77hcs8ntu.public.blob.vercel-storage.com/blooom_secure_v01.png',
        imageAlt: '보안 아이콘',
        bgColor: '#e8f3ff',
        title: (
          <>
            해킹 걱정,<br />이제 그만
          </>
        ),
        description: (
          <>
            KT 전용망을 써서<br />밖에서는 절대 볼 수 없어요.
          </>
        ),
      },
      {
        imageSrc: 'https://ktollehcctv.co/img/checking-devices.png',
        imageAlt: '녹화 아이콘',
        bgColor: '#f0faf6',
        title: (
          <>
            24시간 내내<br />놓치지 않아요
          </>
        ),
        description: (
          <>
            영상이 끊기거나 사라질 걱정 없이<br />모두 기록해요.
          </>
        ),
        imageClassName: 'w-60 h-60 lg:w-72 lg:h-72',
      },
      {
        imageSrc: 'https://hvwgs4k77hcs8ntu.public.blob.vercel-storage.com/blooom_engineer_v01.png',
        imageAlt: '설치 아이콘',
        bgColor: '#fff8e8',
        title: (
          <>
            설치부터 수리까지<br />알아서 해드려요
          </>
        ),
        description: (
          <>
            전문 기사님이 방문하고,<br />A/S도 무료로 받을 수 있어요.
          </>
        ),
        imageAlignBottom: true,
      },
    ],
  },
  support: {
    title: (
      <>
        3년만 내면<br />평생 무료예요
      </>
    ),
    description: '3년 뒤에는 월 이용료가 0원이 돼요.',
  },
  cta: {
    title: (
      <>
        우리 집에 딱 맞는 보안,<br />지금 알아볼까요?
      </>
    ),
    description: '상담사에게 궁금한 점을 편하게 물어보세요.',
    ctaText: '30초 만에 상담 신청하기',
  },
};

/**
 * KT CCTV 랜딩페이지 템플릿
 *
 * subtype에 따라 다른 버전 표시 가능:
 * - 1: 기본형 (설치예약 + 상담)
 * - 2: KT CCTV 홈캠 전환 유도 랜딩
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

  // Contact 페이지 URL
  const contactUrl = getContactUrl(marketerCode, template, subtype);

  // subtype 2: KT CCTV 홈캠 전환 유도 랜딩
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
          <PartnersHero
            title={ktCctvContent.hero.title}
            subtitle={ktCctvContent.hero.subtitle}
            ctaText={ktCctvContent.hero.ctaText}
            ctaHref={contactUrl}
            hideNavButtons={true}
            hideLogo={true}
            logoWithTextUrl="https://i.namu.wiki/i/g-8tEhqgrMv-DLrASvSM-7pgsPos9qX1Lpx3VVOGRYTTZpgtUnWbMEsw7DLDuU7ecjtrkl6nqnCrFqxepgRU1A.svg"
            warningTitle={<><span className="text-3xl lg:text-4xl">중국산 저가 양산품을</span><br /><span className="text-2xl lg:text-3xl">주의하세요!</span></>}
            warningImageUrl="https://hvwgs4k77hcs8ntu.public.blob.vercel-storage.com/blooom_alram_v01.png"
            warningImageAlt="경고 사이렌"
          />
          <PartnersBenefits
            sectionTitle={ktCctvContent.benefits.sectionTitle}
            benefits={ktCctvContent.benefits.benefits}
            logoUrl="https://i.namu.wiki/i/g-8tEhqgrMv-DLrASvSM-7pgsPos9qX1Lpx3VVOGRYTTZpgtUnWbMEsw7DLDuU7ecjtrkl6nqnCrFqxepgRU1A.svg"
            logoAlt="KT 텔레캅"
          />
          <PartnersSupport
            title={ktCctvContent.support.title}
            description={ktCctvContent.support.description}
          />
          <PartnersCTA
            title={ktCctvContent.cta.title}
            description={ktCctvContent.cta.description}
            ctaText={ktCctvContent.cta.ctaText}
            ctaHref={contactUrl}
          />
          {/* 상담 신청 CTA */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-lg mx-auto px-5 text-center">
              <p className="text-gray-600 mb-6">전문 상담사가 친절하게 안내해 드릴게요</p>
              <Link
                href={contactUrl}
                className="inline-block w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-4 px-8 rounded-xl transition-colors shadow-lg shadow-blue-500/25"
              >
                무료 상담 신청하기
              </Link>
            </div>
          </section>
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
        {/* 상담 신청 CTA 섹션 */}
        <section className="bg-gradient-to-b from-blue-500 to-blue-600 py-12 px-5">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              KT CCTV 무료 상담
            </h1>
            <p className="text-blue-100 mb-8">
              전문 상담사가 친절하게 안내해 드릴게요
            </p>
            <Link
              href={contactUrl}
              className="inline-block w-full max-w-xs bg-white hover:bg-gray-50 text-blue-600 text-lg font-semibold py-4 px-8 rounded-xl transition-colors shadow-lg"
            >
              30초 만에 상담 신청하기
            </Link>
          </div>
        </section>
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
        {/* 하단 CTA */}
        <section className="py-12 px-5 bg-gray-50">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              지금 바로 상담 받아보세요
            </h2>
            <Link
              href={contactUrl}
              className="inline-block w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-4 px-8 rounded-xl transition-colors shadow-lg shadow-blue-500/25"
            >
              무료 상담 신청하기
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
