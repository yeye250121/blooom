'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

declare global {
  interface Window {
    kakaoPixel: (id: string) => {
      pageView: () => void;
      completeRegistration: () => void;
    };
    fbq: (action: string, event: string, params?: Record<string, unknown>) => void;
    gtag: (action: string, event: string, params?: Record<string, unknown>) => void;
    APP_CONFIG?: {
      API_BASE_URL: string;
    };
  }
}

interface FormData {
  inquiryType: 'new' | 'as';
  phoneNumber: string;
  installRegion: string;
  installCount: string;
  privacyConsent: boolean;
  referrerUrl: string;
}

// 아이콘 컴포넌트
const PhoneIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const MapPinIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const CameraIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);


const CheckIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const ChevronLeftIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);


/**
 * 통합 상담 신청 페이지
 * URL: /[marketerCode]/[template]/contact
 *
 * 모든 랜딩페이지에서 공통으로 사용하는 상담 신청 폼
 */
export default function ContactPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const marketerCode = (params.code as string)?.toUpperCase();
  const template = params.template as string;
  const fromSubtype = searchParams.get('from') || '1'; // 어느 랜딩에서 왔는지

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    inquiryType: 'new',
    phoneNumber: '',
    installRegion: '',
    installCount: '1',
    privacyConsent: false,
    referrerUrl: '',
  });

  // 최초 유입 URL 저장
  useEffect(() => {
    const STORAGE_KEY = 'initial_referrer';
    let storedReferrer = sessionStorage.getItem(STORAGE_KEY);

    if (!storedReferrer) {
      const referrer = document.referrer;
      const currentUrl = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');

      if (referrer && referrer !== currentUrl) {
        storedReferrer = referrer;
      } else if (utmSource) {
        storedReferrer = `UTM: ${utmSource}`;
        if (utmMedium) storedReferrer += ` / ${utmMedium}`;
        if (utmCampaign) storedReferrer += ` / ${utmCampaign}`;
      } else {
        storedReferrer = '직접 접속';
      }

      sessionStorage.setItem(STORAGE_KEY, storedReferrer);
    }

    setFormData((prev) => ({ ...prev, referrerUrl: storedReferrer || '' }));
  }, []);

  // 전화번호 포맷팅
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 전화번호 유효성 검사
  const isValidPhone = (phone: string) => {
    const pattern = /^(01[0-9]|02|0[3-6][0-9]|070)-?[0-9]{3,4}-?[0-9]{4}$/;
    return pattern.test(phone.replace(/\s/g, ''));
  };

  // 폼 유효성 검사
  const installCountNum = parseInt(formData.installCount) || 0;
  const isFormValid =
    isValidPhone(formData.phoneNumber) &&
    formData.installRegion.trim() !== '' &&
    installCountNum > 0 &&
    formData.privacyConsent;

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || '';

      const requestData = {
        inquiryType: formData.inquiryType === 'new' ? 'consultation' : 'as',
        phoneNumber: formData.phoneNumber.replace(/[^0-9]/g, ''),
        privacyConsent: formData.privacyConsent,
        referrerUrl: formData.referrerUrl,
        marketerCode: marketerCode || null,
        landingTemplate: template,
        landingSubtype: fromSubtype,
        installLocation: formData.installRegion,
        installCount: installCountNum,
      };

      const res = await fetch(`${API_BASE_URL}/landing/api/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '신청 중 오류가 발생했어요');
      }

      // 트래킹 이벤트
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead', { content_name: 'Contact Form' });
      }
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: 'contact_form',
        });
      }
      if (typeof window.kakaoPixel !== 'undefined') {
        window.kakaoPixel('4341098074617891089').completeRegistration();
      }

      setIsComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했어요');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 완료 화면
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-lg mx-auto px-5 py-16">
          <div className="text-center">
            {/* 성공 아이콘 */}
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-8 shadow-lg">
              <CheckIcon className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              상담 신청 완료
            </h1>
            <p className="text-lg text-gray-600 mb-12">
              전문 상담사가 곧 연락드릴게요!
            </p>

            {/* 신청 정보 요약 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <PhoneIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">연락처</p>
                  <p className="text-lg font-medium text-gray-900">{formData.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <MapPinIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">설치 희망 지역</p>
                  <p className="text-lg font-medium text-gray-900">{formData.installRegion}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <CameraIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">설치 예상 대수</p>
                  <p className="text-lg font-medium text-gray-900">{formData.installCount}대</p>
                </div>
              </div>
            </div>

            <Link
              href={`/${marketerCode}/${template}/${fromSubtype}`}
              className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
            >
              <ChevronLeftIcon className="w-5 h-5" />
              랜딩페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 모바일 헤더 - lg 이상에서 숨김 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 lg:hidden">
        <div className="max-w-lg mx-auto px-5 h-16 flex items-center">
          <Link
            href={`/${marketerCode}/${template}/${fromSubtype}`}
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="flex-1 text-center text-lg font-semibold text-gray-900 pr-8">
            상담 신청
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 - 데스크탑 2컬럼, 모바일 1컬럼 */}
      <main className="max-w-6xl mx-auto px-5 py-8 lg:py-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* 좌측: 타이틀 영역 (데스크탑에서만 표시) */}
          <div className="hidden lg:block lg:sticky lg:top-20">
            <Link
              href={`/${marketerCode}/${template}/${fromSubtype}`}
              className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-8"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              돌아가기
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              전화번호를 남겨주시면<br />
              연락드릴게요
            </h1>
            <p className="text-xl text-gray-600">
              평균 1일 내 <span className="text-blue-500 font-semibold">1688-2298</span>로 연락드려요!
            </p>
          </div>

          {/* 우측: 폼 영역 */}
          <div className="lg:bg-white lg:rounded-2xl lg:p-8 lg:shadow-sm lg:border lg:border-gray-100">
            {/* 에러 메시지 */}
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 rounded-xl p-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 문의 유형 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  문의형태
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="inquiryType"
                      checked={formData.inquiryType === 'new'}
                      onChange={() => setFormData(prev => ({ ...prev, inquiryType: 'new' }))}
                      className="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">신규 상담문의</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="inquiryType"
                      checked={formData.inquiryType === 'as'}
                      onChange={() => setFormData(prev => ({ ...prev, inquiryType: 'as' }))}
                      className="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">AS 문의</span>
                  </label>
                </div>
              </div>

              {/* 전화번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder=""
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setFormData((prev) => ({ ...prev, phoneNumber: formatted }));
                  }}
                  className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* 설치 희망 지역 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설치 희망 지역
                </label>
                <input
                  type="text"
                  placeholder="예: 서울시 강남구"
                  value={formData.installRegion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, installRegion: e.target.value }))}
                  className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* 설치 대수 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설치 예상 대수
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="예: 4"
                  value={formData.installCount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData((prev) => ({ ...prev, installCount: value }));
                  }}
                  className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* 개인정보 동의 */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={formData.privacyConsent}
                    onChange={(e) => setFormData(prev => ({ ...prev, privacyConsent: e.target.checked }))}
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  [필수]{' '}
                  <a
                    href="/landing/policies"
                    target="_blank"
                    className="text-blue-500 underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    개인정보 수집 및 이용
                  </a>
                  에 동의합니다. 상담 외 다른 목적으로 사용되지 않아요.
                </span>
              </label>

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full h-14 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-lg font-semibold rounded-xl transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    신청 중...
                  </>
                ) : (
                  '상담신청하기'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
