/**
 * 카카오 알림톡 템플릿 설정
 *
 * 변수 매핑: [*1*] → var1, [*2*] → var2, ...
 */

// 템플릿 코드 (뿌리오 승인 완료)
export const ALIMTALK_TEMPLATES = {
  // 파트너 회원가입 완료 - 본인에게 발송
  // [*1*] = 파트너 코드
  PARTNER_SIGNUP: 'ppur_2025121001502750432330058',

  // 하위 파트너 가입 - 상위 파트너에게 발송
  // [*1*] = 하위 파트너 닉네임
  PARTNER_REFERRAL_SIGNUP: 'ppur_2025121001574211178233002',

  // 정산 내역 도착 - 파트너에게 발송
  PARTNER_SETTLEMENT: 'ppur_2025121002051450432987150',

  // 새로운 상담 문의 - 파트너에게 발송
  PARTNER_NEW_INQUIRY: 'ppur_2025121002080111178865379',

  // 계약 성공 - 파트너에게 발송
  PARTNER_CONTRACT_SUCCESS: 'ppur_2025121002252050432713201',

  // 상담 취소 - 파트너에게 발송
  PARTNER_INQUIRY_CANCELLED: 'ppur_2025121002302950432485683',
} as const

export type AlimtalkTemplateType = keyof typeof ALIMTALK_TEMPLATES

/**
 * 알림톡 발송 시나리오별 변수 매핑
 */
export interface AlimtalkVariables {
  var1?: string // [*1*]
  var2?: string // [*2*]
  var3?: string // [*3*]
  var4?: string // [*4*]
  var5?: string // [*5*]
}

/**
 * 파트너 회원가입 완료 알림톡 변수 생성
 * [*1*] = 파트너 코드
 */
export function getPartnerSignupVariables(partnerCode: string): AlimtalkVariables {
  return {
    var1: partnerCode,
  }
}

/**
 * 하위 파트너 가입 알림톡 변수 생성 (상위 파트너에게 발송)
 * [*1*] = 하위 파트너 닉네임
 */
export function getPartnerReferralSignupVariables(subordinateNickname: string): AlimtalkVariables {
  return {
    var1: subordinateNickname,
  }
}

/**
 * 정산 내역 도착 알림톡 변수 생성
 * (변수 없음)
 */
export function getPartnerSettlementVariables(): AlimtalkVariables {
  return {}
}

/**
 * 새로운 상담 문의 알림톡 변수 생성
 * (변수 없음)
 */
export function getPartnerNewInquiryVariables(): AlimtalkVariables {
  return {}
}

/**
 * 계약 성공 알림톡 변수 생성
 * (변수 없음)
 */
export function getPartnerContractSuccessVariables(): AlimtalkVariables {
  return {}
}

/**
 * 상담 취소 알림톡 변수 생성
 * (변수 없음)
 */
export function getPartnerInquiryCancelledVariables(): AlimtalkVariables {
  return {}
}
