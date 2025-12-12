'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PhoneIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const CalendarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

// 전화번호 포맷팅
const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/[^0-9]/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

// 전화번호 유효성 검사
const isValidPhone = (phone: string) => {
  const pattern = /^(01[0-9])-?[0-9]{3,4}-?[0-9]{4}$/;
  return pattern.test(phone.replace(/\s/g, ''));
};

// KT 로고 URL
const ktLogoUrl = 'https://tukxpfqmibogdwuupcjt.supabase.co/storage/v1/object/public/landing-assets/kt-telecop-logo.svg';

export default function ReservationEntryPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(phoneNumber)) {
      setError('올바른 전화번호를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
      const res = await fetch(`/api/reservation/lookup?phone=${cleanPhone}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || '조회에 실패했습니다');
        return;
      }

      if (!data.inquiry) {
        setError('해당 전화번호로 접수된 문의가 없습니다');
        return;
      }

      // 문의 ID로 리다이렉트
      router.push(`/book/${data.inquiry.id}`);
    } catch (err) {
      console.error('Lookup error:', err);
      setError('서버 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-5 py-8 lg:py-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* 좌측: 타이틀 영역 (데스크탑에서만 표시) */}
          <div className="hidden lg:block lg:sticky lg:top-20">
            <img
              src={ktLogoUrl}
              alt="KT 텔레캅"
              className="h-10 mb-8 ml-1"
            />
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              예약 정보를<br />등록해주세요
            </h1>
            <p className="text-xl text-gray-600">
              상담 신청 시 입력하신 전화번호로<br />
              <span className="text-blue-500 font-semibold">30초</span>만에 예약을 완료하세요
            </p>
          </div>

          {/* 우측: 폼 영역 */}
          <div className="lg:bg-white lg:rounded-2xl lg:p-8 lg:shadow-lg">
            {/* 로고 + 타이틀 - 모바일에서만 표시 */}
            <div className="lg:hidden mb-8 text-center">
              <img
                src={ktLogoUrl}
                alt="KT 텔레캅"
                className="h-8 mx-auto mb-6"
              />
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">예약 정보 등록</h1>
              <p className="text-base text-gray-600">
                상담 신청 시 입력하신 전화번호를<br />입력해주세요
              </p>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white lg:bg-gray-50 rounded-2xl p-5 shadow-sm lg:shadow-none">
                <label className="text-sm text-gray-500 block mb-2">
                  전화번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="010-1234-5678"
                  value={phoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setPhoneNumber(formatted);
                    setError(null);
                  }}
                  className="w-full h-14 px-4 bg-gray-50 lg:bg-white rounded-xl text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 lg:border lg:border-gray-200"
                  autoFocus
                />
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-50 text-red-500 rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={!isValidPhone(phoneNumber) || isLoading}
                className="w-full h-14 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-lg font-semibold rounded-2xl transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    조회 중...
                  </>
                ) : (
                  '문의 내역 조회'
                )}
              </button>
            </form>

            {/* 안내 */}
            <p className="text-center text-sm text-gray-400 mt-8">
              문의 내역이 없으시다면<br />
              먼저 상담 신청을 진행해주세요
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
