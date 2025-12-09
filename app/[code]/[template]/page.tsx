'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

/**
 * /{파트너코드}/{템플릿} → /{파트너코드}/{템플릿}/1 로 리다이렉트
 * 기본 서브타입: 1
 */
export default function TemplateRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const template = params.template as string;

  useEffect(() => {
    // 기본 서브타입(1)으로 리다이렉트
    router.replace(`/${code.toUpperCase()}/${template}/1`);
  }, [code, template, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-action-primary mx-auto"></div>
        <p className="mt-4 text-text-secondary">로딩 중...</p>
      </div>
    </div>
  );
}
