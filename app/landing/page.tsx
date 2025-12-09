'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import KtCctvLanding from '@/app/landing/templates/kt-cctv';

/**
 * 기존 /landing?code=XXX 형식 하위 호환성 유지
 * 새로운 URL: /{code}/{template}/{subtype}
 */
function LandingContent() {
  const searchParams = useSearchParams();
  const marketerCode = searchParams.get('code') || '';

  return (
    <KtCctvLanding
      marketerCode={marketerCode}
      template="kt-cctv"
      subtype="1"
    />
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-action-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">로딩 중...</p>
        </div>
      </div>
    }>
      <LandingContent />
    </Suspense>
  );
}
