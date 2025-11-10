'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import ConsultationForm from '@/app/landing/components/ConsultationForm';
import HowToParticipate from '@/app/landing/components/HowToParticipate';
import SpecialBenefits from '@/app/landing/components/SpecialBenefits';
import Hero from '@/app/landing/components/Hero';
import Features from '@/app/landing/components/Features';
import Footer from '@/app/landing/components/Footer';

function LandingContent() {
  const searchParams = useSearchParams();
  const marketerCode = searchParams.get('code');

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
        <ConsultationForm marketerCode={marketerCode || undefined} />
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

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingContent />
    </Suspense>
  );
}
