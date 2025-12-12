'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: {
          address: string;
          zonecode: string;
          buildingName?: string;
        }) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

interface InquiryData {
  id: string;
  phone_number: string;
  marketer_code: string | null;
  status: string;
  inquiry_type: string;
  reservation_date: string | null;
  reservation_time_slot: string | null;
  address: string | null;
  address_detail: string | null;
  zonecode: string | null;
  outdoor_count: number | null;
  indoor_count: number | null;
  documents: Record<string, string> | null;
  documents_submitted: boolean;
  created_at: string;
}

interface BlockedDate {
  blocked_date: string;
  is_blocked: boolean;
}

type TimeSlot = 'morning' | 'afternoon';
type Step = 'loading' | 'info' | 'calendar' | 'count' | 'address' | 'documents' | 'complete' | 'error' | 'already_submitted';

// 아이콘 컴포넌트들
const CalendarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

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

const SunIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const IdCardIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
  </svg>
);

const CreditCardIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);

const BuildingIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
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

const ChevronRightIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

// 전화번호 포맷팅
const formatPhoneNumber = (phone: string) => {
  const numbers = phone.replace(/[^0-9]/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

export default function ReservationPage() {
  const params = useParams();
  const inquiryId = params.id as string;

  const [step, setStep] = useState<Step>('loading');
  const [inquiry, setInquiry] = useState<InquiryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 폼 데이터
  const [formData, setFormData] = useState({
    reservationDate: null as Date | null,
    reservationTimeSlot: null as TimeSlot | null,
    outdoorCount: 1,
    indoorCount: 0,
    address: '',
    addressDetail: '',
    zonecode: '',
    documents: {
      idCard: null as File | null,
      paymentCard: null as File | null,
      businessLicense: null as File | null,
    },
  });

  // 문의 정보 조회
  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const res = await fetch(`/api/reservation/${inquiryId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('문의 정보를 찾을 수 없습니다');
            setStep('error');
            return;
          }
          throw new Error('조회 실패');
        }

        const data = await res.json();
        setInquiry(data.inquiry);

        // 이미 예약 정보가 완료된 경우
        if (data.inquiry.documents_submitted || data.inquiry.status === 'reservation_complete') {
          setStep('already_submitted');
          return;
        }

        // 기존 데이터가 있으면 폼에 채우기
        if (data.inquiry.reservation_date) {
          setFormData(prev => ({
            ...prev,
            reservationDate: new Date(data.inquiry.reservation_date),
            reservationTimeSlot: data.inquiry.reservation_time_slot as TimeSlot,
            outdoorCount: data.inquiry.outdoor_count || 1,
            indoorCount: data.inquiry.indoor_count || 0,
            address: data.inquiry.address || '',
            addressDetail: data.inquiry.address_detail || '',
            zonecode: data.inquiry.zonecode || '',
          }));
        }

        setStep('info');
      } catch (err) {
        console.error('Fetch error:', err);
        setError('문의 정보를 불러오는데 실패했습니다');
        setStep('error');
      }
    };

    if (inquiryId) {
      fetchInquiry();
    }
  }, [inquiryId]);

  // 예약 불가일 조회
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const res = await fetch('/api/reservation/blocked-dates');
        if (res.ok) {
          const data = await res.json();
          setBlockedDates(data.blockedDates || []);
        }
      } catch (err) {
        console.error('Failed to fetch blocked dates:', err);
      }
    };
    fetchBlockedDates();
  }, []);

  // 날짜가 예약 불가능한지 확인
  const isDateBlocked = useCallback(
    (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (date < today) return true;

      const minDate = new Date(today);
      minDate.setDate(minDate.getDate() + 3);
      if (date < minDate) {
        const dateStr = date.toISOString().split('T')[0];
        const override = blockedDates.find((b) => b.blocked_date === dateStr);
        if (override && !override.is_blocked) return false;
        return true;
      }

      const dateStr = date.toISOString().split('T')[0];
      const blocked = blockedDates.find((b) => b.blocked_date === dateStr);
      if (blocked && blocked.is_blocked) return true;

      return false;
    },
    [blockedDates]
  );

  // 카카오 주소 검색
  const openAddressSearch = () => {
    if (typeof window !== 'undefined' && window.daum) {
      new window.daum.Postcode({
        oncomplete: (data) => {
          setFormData((prev) => ({
            ...prev,
            address: data.address,
            zonecode: data.zonecode,
          }));
        },
      }).open();
    }
  };

  // 파일 업로드 처리
  const handleFileChange = (
    type: 'idCard' | 'paymentCard' | 'businessLicense',
    file: File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: file,
      },
    }));
  };

  // 폼 제출
  const handleSubmit = async (skipDocuments = false) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let documentUrls: Record<string, string> = {};

      // 서류 업로드
      if (!skipDocuments) {
        const uploadPromises = [];
        const fileTypes = ['idCard', 'paymentCard', 'businessLicense'] as const;

        for (const fileType of fileTypes) {
          const file = formData.documents[fileType];
          if (file) {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('type', fileType);

            uploadPromises.push(
              fetch('/api/reservation/upload', {
                method: 'POST',
                body: formDataUpload,
              }).then(async (res) => {
                if (res.ok) {
                  const data = await res.json();
                  return { type: fileType, url: data.url };
                }
                return null;
              })
            );
          }
        }

        const results = await Promise.all(uploadPromises);
        results.forEach((result) => {
          if (result) {
            documentUrls[result.type] = result.url;
          }
        });
      }

      // 예약 정보 업데이트
      const res = await fetch(`/api/reservation/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationDate: formData.reservationDate?.toISOString().split('T')[0],
          reservationTimeSlot: formData.reservationTimeSlot,
          outdoorCount: formData.outdoorCount,
          indoorCount: formData.indoorCount,
          address: formData.address,
          addressDetail: formData.addressDetail,
          zonecode: formData.zonecode,
          documents: documentUrls,
          documentsSubmitted: Object.keys(documentUrls).length > 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '저장 중 오류가 발생했습니다');
      }

      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 캘린더 렌더링
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    for (let i = 0; i < dayNames.length; i++) {
      days.push(
        <div
          key={`header-${i}`}
          className={`flex items-center justify-center h-10 text-sm font-medium ${
            i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          {dayNames[i]}
        </div>
      );
    }

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const isBlocked = isDateBlocked(date);
      const isSelected =
        formData.reservationDate &&
        formData.reservationDate.toDateString() === date.toDateString();
      const dayOfWeek = date.getDay();

      days.push(
        <button
          key={day}
          type="button"
          disabled={isBlocked}
          onClick={() => setFormData((prev) => ({ ...prev, reservationDate: date }))}
          className={`
            h-12 rounded-xl text-base font-medium transition-all
            ${isBlocked
              ? 'text-gray-300 cursor-not-allowed'
              : isSelected
                ? 'bg-blue-500 text-white'
                : dayOfWeek === 0
                  ? 'text-red-500 hover:bg-gray-100'
                  : dayOfWeek === 6
                    ? 'text-blue-500 hover:bg-gray-100'
                    : 'text-gray-900 hover:bg-gray-100'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const steps: Step[] = ['info', 'calendar', 'count', 'address', 'documents'];
  const currentStepIndex = steps.indexOf(step);
  const totalSteps = steps.length;

  const goNext = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 로딩 화면
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">문의 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 화면
  if (step === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // 이미 제출 완료
  if (step === 'already_submitted') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">이미 예약이 완료되었습니다</h2>
          <p className="text-gray-600">담당자가 확인 후 연락드릴 예정이에요</p>
        </div>
      </div>
    );
  }

  // 완료 화면
  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 px-5 py-8">
        <div className="max-w-md mx-auto flex flex-col items-center pt-16">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mb-6 animate-bounce">
            <CheckIcon className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            예약 정보 등록 완료
          </h2>
          <p className="text-base text-gray-600 text-center mb-8">
            담당자가 확인 후 예약 확정 문자를 보내드려요
          </p>

          {formData.reservationDate && (
            <div className="w-full bg-white rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-base text-gray-900">
                  {formData.reservationDate.toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short',
                  })}{' '}
                  {formData.reservationTimeSlot === 'morning' ? '오전' : '오후'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <MapPinIcon className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-base text-gray-900">{formData.address}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Daum 주소 API */}
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        {currentStepIndex > 0 && (
          <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm">
            <div className="max-w-md mx-auto px-5 h-14 flex items-center">
              <button
                type="button"
                onClick={goBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-xl hover:bg-white/60 transition-colors"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-900" />
              </button>

              <div className="flex-1 mx-4">
                <div className="h-1 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              <span className="text-sm text-gray-500">
                {currentStepIndex + 1}/{totalSteps}
              </span>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="max-w-md mx-auto px-5 mt-4">
            <div className="bg-red-50 text-red-500 rounded-xl p-4 text-sm">
              {error}
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto px-5 py-6">
          {/* Step: 정보 확인 */}
          {step === 'info' && inquiry && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">예약 정보를 등록해주세요</h2>
              <p className="text-base text-gray-600 mb-8">상담 신청하신 내역이에요</p>

              <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">연락처</p>
                    <p className="text-base text-gray-900">{formatPhoneNumber(inquiry.phone_number)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <CalendarIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">신청일</p>
                    <p className="text-base text-gray-900">
                      {new Date(inquiry.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={goNext}
                className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-2xl transition-colors shadow-lg"
              >
                예약 정보 입력하기
              </button>
            </div>
          )}

          {/* Step: 캘린더 */}
          {step === 'calendar' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">설치 날짜를 골라주세요</h2>
              <p className="text-base text-gray-600 mb-6">원하는 날짜에 바로 설치 받을 수 있어요</p>

              <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-900" />
                  </button>
                  <span className="text-lg font-semibold text-gray-900">
                    {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-900" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 bg-gray-50 rounded-xl p-2">{renderCalendar()}</div>
              </div>

              {formData.reservationDate && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">시간대를 선택해주세요</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, reservationTimeSlot: 'morning' }))}
                      className={`
                        p-4 rounded-2xl transition-all
                        ${formData.reservationTimeSlot === 'morning'
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-white text-gray-900 shadow-sm hover:shadow-md'
                        }
                      `}
                    >
                      <SunIcon className={`w-8 h-8 mx-auto mb-2 ${formData.reservationTimeSlot === 'morning' ? 'text-white' : 'text-yellow-500'}`} />
                      <span className="text-lg font-semibold block">오전</span>
                      <span className={`text-sm ${formData.reservationTimeSlot === 'morning' ? 'text-white/80' : 'text-gray-500'}`}>9시~12시</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, reservationTimeSlot: 'afternoon' }))}
                      className={`
                        p-4 rounded-2xl transition-all
                        ${formData.reservationTimeSlot === 'afternoon'
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-white text-gray-900 shadow-sm hover:shadow-md'
                        }
                      `}
                    >
                      <MoonIcon className={`w-8 h-8 mx-auto mb-2 ${formData.reservationTimeSlot === 'afternoon' ? 'text-white' : 'text-blue-500'}`} />
                      <span className="text-lg font-semibold block">오후</span>
                      <span className={`text-sm ${formData.reservationTimeSlot === 'afternoon' ? 'text-white/80' : 'text-gray-500'}`}>13시~18시</span>
                    </button>
                  </div>
                </div>
              )}

              {formData.reservationDate && formData.reservationTimeSlot && (
                <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-gray-50 via-gray-50">
                  <div className="max-w-md mx-auto">
                    <button
                      type="button"
                      onClick={goNext}
                      className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-2xl transition-colors shadow-lg"
                    >
                      {formData.reservationDate.toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short',
                      })}{' '}
                      {formData.reservationTimeSlot === 'morning' ? '오전' : '오후'}으로 예약하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step: 설치 대수 */}
          {step === 'count' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">설치할 CCTV 대수를 알려주세요</h2>
              <p className="text-base text-gray-600 mb-8">정확하지 않아도 괜찮아요</p>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">실외 설치</h4>
                      <p className="text-sm text-gray-500">건물 외부, 주차장 등</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            outdoorCount: Math.max(0, prev.outdoorCount - 1),
                          }))
                        }
                        className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 text-xl font-medium hover:bg-gray-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-lg font-semibold text-gray-900">
                        {formData.outdoorCount}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            outdoorCount: Math.min(99, prev.outdoorCount + 1),
                          }))
                        }
                        className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white text-xl font-medium hover:bg-blue-600 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">실내 설치</h4>
                      <p className="text-sm text-gray-500">사무실, 매장 내부 등</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            indoorCount: Math.max(0, prev.indoorCount - 1),
                          }))
                        }
                        className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 text-xl font-medium hover:bg-gray-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-lg font-semibold text-gray-900">
                        {formData.indoorCount}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            indoorCount: Math.min(99, prev.indoorCount + 1),
                          }))
                        }
                        className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white text-xl font-medium hover:bg-blue-600 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  disabled={formData.outdoorCount + formData.indoorCount === 0}
                  onClick={goNext}
                  className="w-full h-14 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-lg font-semibold rounded-2xl transition-colors disabled:cursor-not-allowed shadow-lg"
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {/* Step: 주소 */}
          {step === 'address' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">설치할 주소를 입력해주세요</h2>
              <p className="text-base text-gray-600 mb-8">정확한 주소를 알려주세요</p>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <label className="text-sm text-gray-500 block mb-2">
                    주소 검색 <span className="text-red-500">*</span>
                  </label>
                  {formData.address ? (
                    <button
                      type="button"
                      onClick={openAddressSearch}
                      className="w-full h-14 px-4 bg-gray-50 rounded-xl text-left flex items-center justify-between"
                    >
                      <span className="text-base text-gray-900 truncate">{formData.address}</span>
                      <span className="text-sm text-blue-500 flex-shrink-0 ml-2">변경</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={openAddressSearch}
                      className="w-full h-14 px-4 bg-gray-50 rounded-xl text-base text-gray-400 text-left flex items-center gap-2 hover:bg-gray-100 transition-colors"
                    >
                      <SearchIcon className="w-5 h-5" />
                      주소 검색하기
                    </button>
                  )}
                </div>

                {formData.address && (
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <label className="text-sm text-gray-500 block mb-2">상세 주소</label>
                    <input
                      type="text"
                      placeholder="건물명, 층수, 호수 등"
                      value={formData.addressDetail}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, addressDetail: e.target.value }))
                      }
                      className="w-full h-14 px-4 bg-gray-50 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                )}
              </div>

              {formData.address && (
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={goNext}
                    className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-2xl transition-colors shadow-lg"
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step: 서류 첨부 */}
          {step === 'documents' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">서류를 첨부해주세요</h2>
              <p className="text-base text-gray-600 mb-8">서류를 첨부하면 예약이 빨라져요</p>

              <div className="space-y-3">
                {/* 신분증 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <IdCardIcon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">신분증</h4>
                        <p className="text-sm text-gray-500">주민등록증이나 운전면허증</p>
                      </div>
                    </div>
                    <label
                      className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                        formData.documents.idCard
                          ? 'bg-green-50 text-green-600'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {formData.documents.idCard ? (
                        <span className="flex items-center gap-1">
                          <CheckIcon className="w-4 h-4" /> 첨부됨
                        </span>
                      ) : '첨부하기'}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange('idCard', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>

                {/* 결제 수단 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <CreditCardIcon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">결제 수단</h4>
                        <p className="text-sm text-gray-500">결제할 카드나 통장 사본</p>
                      </div>
                    </div>
                    <label
                      className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                        formData.documents.paymentCard
                          ? 'bg-green-50 text-green-600'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {formData.documents.paymentCard ? (
                        <span className="flex items-center gap-1">
                          <CheckIcon className="w-4 h-4" /> 첨부됨
                        </span>
                      ) : '첨부하기'}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange('paymentCard', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>

                {/* 사업자등록증 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <BuildingIcon className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">사업자등록증</h4>
                        <p className="text-sm text-gray-500">사업자 계약 시에만 첨부해주세요</p>
                      </div>
                    </div>
                    <label
                      className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                        formData.documents.businessLicense
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {formData.documents.businessLicense ? (
                        <span className="flex items-center gap-1">
                          <CheckIcon className="w-4 h-4 text-green-600" /> 첨부됨
                        </span>
                      ) : '첨부하기'}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange('businessLicense', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(false)}
                  className="w-full h-14 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-lg font-semibold rounded-2xl transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
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
                    '예약 완료하기'
                  )}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(true)}
                  className="w-full h-14 text-gray-500 text-base hover:text-gray-700 transition-colors"
                >
                  나중에 제출할게요
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
