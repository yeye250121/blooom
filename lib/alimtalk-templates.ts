/**
 * 카카오 알림톡 템플릿 설정
 *
 * 템플릿 코드는 뿌리오에서 승인 후 업데이트 필요
 * 변수 매핑: [*이름*] → name, [*1*] → var1, [*2*] → var2, ...
 */

// 템플릿 코드 (승인 후 업데이트)
export const ALIMTALK_TEMPLATES = {
  // 파트너 관련
  PARTNER_SIGNUP_COMPLETE: '', // 회원가입 완료
  PARTNER_NEW_INQUIRY: '', // 새 문의 접수 알림
  PARTNER_INQUIRY_STATUS_CHANGED: '', // 문의 상태 변경 알림
  PARTNER_SETTLEMENT_REGISTERED: '', // 정산 등록 알림
  PARTNER_SETTLEMENT_COMPLETED: '', // 정산 완료 알림

  // 고객 관련 (필요시 추가)
  // CUSTOMER_INQUIRY_RECEIVED: '', // 문의 접수 확인
  // CUSTOMER_CONSULTATION_SCHEDULED: '', // 상담 예약 확인
} as const

export type AlimtalkTemplateType = keyof typeof ALIMTALK_TEMPLATES

/**
 * 알림톡 발송 시나리오별 변수 매핑
 */
export interface AlimtalkVariables {
  name?: string // [*이름*]
  var1?: string // [*1*]
  var2?: string // [*2*]
  var3?: string // [*3*]
  var4?: string // [*4*]
  var5?: string // [*5*]
  var6?: string // [*6*]
  var7?: string // [*7*]
  var8?: string // [*8*]
}

/**
 * 파트너 회원가입 완료 알림톡 변수 생성
 */
export function getSignupCompleteVariables(partnerName: string): AlimtalkVariables {
  return {
    name: partnerName,
  }
}

/**
 * 새 문의 접수 알림톡 변수 생성
 */
export function getNewInquiryVariables(
  partnerName: string,
  customerName: string,
  customerPhone: string,
  inquiryDate: string
): AlimtalkVariables {
  return {
    name: partnerName,
    var1: customerName, // 고객명
    var2: customerPhone.slice(-4), // 전화번호 뒷 4자리
    var3: inquiryDate, // 접수일시
  }
}

/**
 * 문의 상태 변경 알림톡 변수 생성
 */
export function getInquiryStatusChangedVariables(
  partnerName: string,
  customerName: string,
  newStatus: string,
  changedDate: string
): AlimtalkVariables {
  return {
    name: partnerName,
    var1: customerName, // 고객명
    var2: newStatus, // 변경된 상태
    var3: changedDate, // 변경일시
  }
}

/**
 * 정산 등록 알림톡 변수 생성
 */
export function getSettlementRegisteredVariables(
  partnerName: string,
  settlementMonth: string,
  totalAmount: string,
  settlementDate: string
): AlimtalkVariables {
  return {
    name: partnerName,
    var1: settlementMonth, // 정산 월
    var2: totalAmount, // 정산 금액
    var3: settlementDate, // 지급 예정일
  }
}

/**
 * 정산 완료 알림톡 변수 생성
 */
export function getSettlementCompletedVariables(
  partnerName: string,
  settlementMonth: string,
  totalAmount: string,
  completedDate: string
): AlimtalkVariables {
  return {
    name: partnerName,
    var1: settlementMonth, // 정산 월
    var2: totalAmount, // 정산 금액
    var3: completedDate, // 지급 완료일
  }
}
