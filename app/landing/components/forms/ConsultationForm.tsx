'use client';

import { useState, useEffect } from 'react';

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

interface ConsultationFormProps {
  marketerCode?: string;
  landingTemplate?: string;
  landingSubtype?: string;
}

interface FormData {
  phoneNumber: string;
  installRegion: string;
  installCount: number;
  privacyConsent: boolean;
  referrerUrl: string;
}

// 아이콘 컴포넌트들
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
 * kt-cctv/1 전용 상담 신청 폼
 * - Step 1: 전화번호, 설치 희망 지역, 설치 대수
 * - Step 2: 개인정보 동의 및 확인
 */
export default function ConsultationForm({ marketerCode, landingTemplate = 'kt-cctv', landingSubtype = '1' }: ConsultationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    installRegion: '',
    installCount: 1,
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

  // 폼 제출
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || '';

      const requestData = {
        inquiryType: 'consultation',
        phoneNumber: formData.phoneNumber.replace(/[^0-9]/g, ''),
        privacyConsent: formData.privacyConsent,
        referrerUrl: formData.referrerUrl,
        marketerCode: marketerCode || null,
        landingTemplate,
        landingSubtype,
        // 추가 필드
        installLocation: formData.installRegion,
        installCount: formData.installCount,
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

      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead', {
          content_name: 'Consultation Request',
        });
      }

      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: 'consultation_form',
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

  const steps = ['info', 'confirm'];
  const totalSteps = steps.length;

  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step 1 유효성 체크
  const isStep1Valid = isValidPhone(formData.phoneNumber) && formData.installRegion.trim() !== '' && formData.installCount > 0;

  // 완료 화면
  if (isComplete) {
    return (
      <section className="min-h-screen bg-bg-primary px-5 py-8">
        <div className="max-w-md mx-auto flex flex-col items-center pt-16">
          {/* 성공 아이콘 */}
          <div className="w-20 h-20 rounded-full bg-action-primary flex items-center justify-center mb-6 animate-scale-in">
            <CheckIcon className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-headline text-text-primary text-center mb-2">
            상담 신청 완료
          </h2>
          <p className="text-body text-text-secondary text-center mb-8">
            전문 상담사가 곧 연락드려요
          </p>

          {/* 신청 정보 요약 */}
          <div className="w-full bg-white rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-action-primary/10 flex items-center justify-center">
                <PhoneIcon className="w-5 h-5 text-action-primary" />
              </div>
              <span className="text-body text-text-primary">{formData.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-action-primary/10 flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-action-primary" />
              </div>
              <span className="text-body text-text-primary">{formData.installRegion}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-action-primary/10 flex items-center justify-center">
                <CameraIcon className="w-5 h-5 text-action-primary" />
              </div>
              <span className="text-body text-text-primary">CCTV {formData.installCount}대</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentStepName = steps[currentStep];

  return (
    <section className="min-h-screen bg-bg-primary">
      {/* 헤더 */}
      {currentStep > 0 && (
        <div className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-sm">
          <div className="max-w-md mx-auto px-5 h-14 flex items-center">
            <button
              type="button"
              onClick={goBack}
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-xl hover:bg-white/60 transition-colors"
            >
              <ChevronLeftIcon className="w-6 h-6 text-text-primary" />
            </button>

            {/* 진행률 바 */}
            <div className="flex-1 mx-4">
              <div className="h-1 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-action-primary transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <span className="text-caption text-text-secondary">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="max-w-md mx-auto px-5 mt-4">
          <div className="bg-error/10 text-error rounded-xl p-4 text-caption">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-5 py-6">
        {/* Step 1: 정보 입력 */}
        {currentStepName === 'info' && (
          <div className="animate-scale-in">
            <h2 className="text-headline text-text-primary mb-2">상담 신청하기</h2>
            <p className="text-body text-text-secondary mb-8">전문 상담사가 친절하게 안내해드려요</p>

            <div className="space-y-4">
              {/* 전화번호 */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <label className="text-caption text-text-secondary block mb-2">
                  전화번호 <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="010-1234-5678"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setFormData((prev) => ({ ...prev, phoneNumber: formatted }));
                  }}
                  className="w-full h-14 px-4 bg-bg-primary rounded-xl text-title text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-action-primary/30"
                />
              </div>

              {/* 설치 희망 지역 */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <label className="text-caption text-text-secondary block mb-2">
                  설치 희망 지역 <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 서울시 강남구, 경기도 성남시"
                  value={formData.installRegion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, installRegion: e.target.value }))}
                  className="w-full h-14 px-4 bg-bg-primary rounded-xl text-title text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-action-primary/30"
                />
              </div>

              {/* 설치 대수 */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <label className="text-caption text-text-secondary block mb-3">
                  설치 예상 대수 <span className="text-error">*</span>
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-body text-text-secondary">정확하지 않아도 괜찮아요</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          installCount: Math.max(1, prev.installCount - 1),
                        }))
                      }
                      className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center text-text-primary text-xl font-medium hover:bg-bg-primary/70 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-title text-text-primary">
                      {formData.installCount}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          installCount: Math.min(99, prev.installCount + 1),
                        }))
                      }
                      className="w-10 h-10 rounded-xl bg-action-primary flex items-center justify-center text-white text-xl font-medium hover:bg-action-primary-hover transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 다음 버튼 */}
            <div className="mt-8">
              <button
                type="button"
                disabled={!isStep1Valid}
                onClick={goNext}
                className="w-full h-14 bg-action-primary hover:bg-action-primary-hover disabled:bg-text-tertiary text-white text-title rounded-2xl transition-colors disabled:cursor-not-allowed shadow-lg"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 확인/동의 */}
        {currentStepName === 'confirm' && (
          <div className="animate-scale-in">
            <h2 className="text-headline text-text-primary mb-2">신청 정보 확인</h2>
            <p className="text-body text-text-secondary mb-6">정보가 맞는지 확인해주세요</p>

            {/* 요약 카드 */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-action-primary/10 flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-5 h-5 text-action-primary" />
                </div>
                <div>
                  <p className="text-caption text-text-secondary">연락처</p>
                  <p className="text-body text-text-primary">{formData.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-action-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 text-action-primary" />
                </div>
                <div>
                  <p className="text-caption text-text-secondary">설치 희망 지역</p>
                  <p className="text-body text-text-primary">{formData.installRegion}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-action-primary/10 flex items-center justify-center flex-shrink-0">
                  <CameraIcon className="w-5 h-5 text-action-primary" />
                </div>
                <div>
                  <p className="text-caption text-text-secondary">설치 예상 대수</p>
                  <p className="text-body text-text-primary">CCTV {formData.installCount}대</p>
                </div>
              </div>
            </div>

            {/* 동의 체크박스 */}
            <label className="flex items-start gap-3 cursor-pointer mb-8 bg-white rounded-2xl p-4 shadow-sm">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={formData.privacyConsent}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, privacyConsent: e.target.checked }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    formData.privacyConsent
                      ? 'bg-action-primary'
                      : 'bg-bg-primary'
                  }`}
                >
                  {formData.privacyConsent && (
                    <CheckIcon className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
              <span className="text-body text-text-primary">
                <a
                  href="/landing/policies"
                  target="_blank"
                  className="text-action-primary underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  개인정보 처리방침
                </a>
                에 동의합니다 <span className="text-error">*</span>
              </span>
            </label>

            <button
              type="button"
              disabled={!formData.privacyConsent || isSubmitting}
              onClick={handleSubmit}
              className="w-full h-14 bg-action-primary hover:bg-action-primary-hover disabled:bg-text-tertiary text-white text-title rounded-2xl transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  제출 중...
                </>
              ) : (
                '상담 신청하기'
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
