// 문의 요청 데이터 타입
export interface InquiryRequest {
  referrerUrl?: string;
  phoneNumber: string;
  installLocation: string;
  installCount: number;
  privacyConsent: boolean;
  submittedAt?: string;
}

// 문의 응답 데이터 타입
export interface InquiryResponse {
  phoneLastFour: string;
  installLocation: string;
  installCount: number;
  message: string;
}

// 폼 데이터 타입
export interface FormData {
  phoneNumber: string;
  installLocation: string;
  installCount: number;
  privacyConsent: boolean;
}

// Google Sheets 데이터 타입
export interface SheetsData {
  referrerUrl: string;
  phoneNumber: string;
  installLocation: string;
  installCount: number;
  submittedAt: string;
  privacyConsent: string; // 'Y' or 'N'
}
