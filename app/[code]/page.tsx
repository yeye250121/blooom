'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CodeRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  useEffect(() => {
    // 코드를 쿼리 파라미터로 변환하여 landing 페이지로 리다이렉트
    router.replace(`/landing?code=${code.toUpperCase()}`);
  }, [code, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}
