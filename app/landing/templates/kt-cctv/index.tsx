'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import {
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

// KT CCTV 랜딩 subtype 1 전용 콘텐츠 (가성비/신뢰 컨셉)
const ktCctvContent1 = {
  hero: {
    title: (
      <>
        전국 100만+ 명의 선택
      </>
    ),
    subtitle: '대한민국 1등 보안기업',
    ctaText: '프로모션 받기',
  },
  support: {
    title: (
      <>
        다른 렌탈은<br />평생 내요
      </>
    ),
    description: 'KT는 3년만 내면 끝. 그 뒤로는 월 0원이에요.',
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
  reviews: [
    {
      id: 'lov****',
      content: 'CCTV 알아보느라 머리 아팠는데 다른 곳은 다 평생 렌탈이더라고요ㅠ 근데 KT는 3년만 내면 끝! 계산해 보니 이게 완전 이득임니다 약정 끝나면 요금 안 나가는 게 진짜 좋네요',
    },
    {
      id: 'qwe**',
      content: '오늘 설치 받았는데 배선 정리 진짜 예술이네요... 선 하나도 안 보이게 싹 감춰주심! ㅎㅎ 화질 짱짱하네요. 기계치라 걱정했는데 어플 연결까지 친절하게 다 해주시고 가셨어요 ^^',
    },
    {
      id: 'caf*****',
      content: '가게가 바빠서 평일엔 도저히 시간이 안 났는데, 토요일 설치 가능해서 완전 다행이었어요! 추운 날씨에 밖에서 작업하시느라 고생 많으셨습니다 ㅠㅠ 덕분에 맘 편히 장사하겠어요~',
    },
    {
      id: 'joy**',
      content: '여기저기 발품 팔아봤는데 가성비는 KT가 갑인 듯요. 오늘 설치 마쳤는데 선정리도 깔끔하고 맘에 듭니다',
    },
  ],
  cta: {
    title: (
      <>
        우리 집에 딱 맞는 보안,<br />지금 알아볼까요?
      </>
    ),
    description: '상담사에게 궁금한 점을 편하게 물어보세요.',
    ctaText: '지금 프로모션 받기',
  },
};

// KT CCTV 랜딩 subtype 2 전용 콘텐츠 (공포 마케팅 컨셉)
const ktCctvContent2 = {
  hero: {
    title: (
      <>
        해킹 걱정 없이<br />안전하게 지켜요
      </>
    ),
    subtitle: 'KT 텔레캅이 든든하게 막아드릴게요.',
    ctaText: '무료로 상담받기',
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

// 리뷰 섹션 컴포넌트
const ReviewsSection = ({ reviews }: { reviews: { id: string; content: string }[] }) => (
  <section className="py-16 lg:py-24 px-5 bg-gray-50">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-4">
        먼저 사용한 고객님들의<br />솔직한 후기예요
      </h2>
      <div className="mt-10 space-y-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-blue-600 mb-2">{review.id}</p>
            <p className="text-gray-700 leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

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

  // subtype 2: KT CCTV 공포 마케팅 컨셉 (저가 양산품 주의)
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
            title={ktCctvContent2.hero.title}
            subtitle={ktCctvContent2.hero.subtitle}
            ctaText={ktCctvContent2.hero.ctaText}
            ctaHref={contactUrl}
            hideNavButtons={true}
            hideLogo={true}
            logoWithTextUrl="https://i.namu.wiki/i/g-8tEhqgrMv-DLrASvSM-7pgsPos9qX1Lpx3VVOGRYTTZpgtUnWbMEsw7DLDuU7ecjtrkl6nqnCrFqxepgRU1A.svg"
            warningTitle={<><span className="text-3xl lg:text-4xl">중국산 저가 양산품을</span><br /><span className="text-2xl lg:text-3xl">주의하세요!</span></>}
            warningImageUrl="https://hvwgs4k77hcs8ntu.public.blob.vercel-storage.com/blooom_alram_v01.png"
            warningImageAlt="경고 사이렌"
          />
          <PartnersBenefits
            sectionTitle={ktCctvContent2.benefits.sectionTitle}
            benefits={ktCctvContent2.benefits.benefits}
            logoUrl="https://i.namu.wiki/i/g-8tEhqgrMv-DLrASvSM-7pgsPos9qX1Lpx3VVOGRYTTZpgtUnWbMEsw7DLDuU7ecjtrkl6nqnCrFqxepgRU1A.svg"
            logoAlt="KT 텔레캅"
          />
          <PartnersSupport
            title={ktCctvContent2.support.title}
            description={ktCctvContent2.support.description}
          />
          <PartnersCTA
            title={ktCctvContent2.cta.title}
            description={ktCctvContent2.cta.description}
            ctaText={ktCctvContent2.cta.ctaText}
            ctaHref={contactUrl}
          />
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

  // 기본 레이아웃 (subtype 1) - 가성비/신뢰 컨셉
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
        {/* Hero: KT 로고 + 신뢰 메시지 */}
        <PartnersHero
          title={ktCctvContent1.hero.title}
          subtitle={ktCctvContent1.hero.subtitle}
          ctaText={ktCctvContent1.hero.ctaText}
          ctaHref={contactUrl}
          hideNavButtons={true}
          hideLogo={true}
          logoWithTextUrl="https://i.namu.wiki/i/g-8tEhqgrMv-DLrASvSM-7pgsPos9qX1Lpx3VVOGRYTTZpgtUnWbMEsw7DLDuU7ecjtrkl6nqnCrFqxepgRU1A.svg"
        />
        {/* 가격 혜택: 3년 후 무료 */}
        <PartnersSupport
          title={ktCctvContent1.support.title}
          description={ktCctvContent1.support.description}
        />
        {/* 품질 혜택 */}
        <PartnersBenefits
          sectionTitle={ktCctvContent1.benefits.sectionTitle}
          benefits={ktCctvContent1.benefits.benefits}
          logoUrl="https://i.namu.wiki/i/g-8tEhqgrMv-DLrASvSM-7pgsPos9qX1Lpx3VVOGRYTTZpgtUnWbMEsw7DLDuU7ecjtrkl6nqnCrFqxepgRU1A.svg"
          logoAlt="KT 텔레캅"
        />
        {/* 리뷰 섹션 */}
        <ReviewsSection reviews={ktCctvContent1.reviews} />
        {/* CTA */}
        <PartnersCTA
          title={ktCctvContent1.cta.title}
          description={ktCctvContent1.cta.description}
          ctaText={ktCctvContent1.cta.ctaText}
          ctaHref={contactUrl}
        />
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
