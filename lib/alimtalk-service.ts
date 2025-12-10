/**
 * 알림톡 발송 서비스
 *
 * 각 비즈니스 시나리오에 맞는 알림톡 발송 함수 제공
 */

import { sendAlimtalkToOne } from './ppurio'
import {
  ALIMTALK_TEMPLATES,
  getPartnerSignupVariables,
  getPartnerReferralSignupVariables,
  getPartnerSettlementVariables,
  getPartnerNewInquiryVariables,
  getPartnerContractSuccessVariables,
  getPartnerInquiryCancelledVariables,
} from './alimtalk-templates'

/**
 * 알림톡 발송 결과
 */
interface SendResult {
  success: boolean
  messageKey?: string
  error?: string
}

/**
 * 파트너 회원가입 완료 알림톡 발송
 * - 가입한 파트너 본인에게 발송
 * - [*1*] = 파트너 코드
 */
export async function sendPartnerSignupAlimtalk(
  phoneNumber: string,
  partnerCode: string
): Promise<SendResult> {
  const templateCode = ALIMTALK_TEMPLATES.PARTNER_SIGNUP

  try {
    const variables = getPartnerSignupVariables(partnerCode)
    const result = await sendAlimtalkToOne(templateCode, phoneNumber, variables)
    return { success: true, messageKey: result.messageKey }
  } catch (error: any) {
    console.error('[Alimtalk] 파트너 회원가입 알림톡 발송 실패:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * 하위 파트너 가입 알림톡 발송
 * - 상위 파트너(추천인)에게 발송
 * - [*1*] = 가입한 하위 파트너 닉네임
 */
export async function sendPartnerReferralSignupAlimtalk(
  referrerPhoneNumber: string,
  subordinateNickname: string
): Promise<SendResult> {
  const templateCode = ALIMTALK_TEMPLATES.PARTNER_REFERRAL_SIGNUP

  try {
    const variables = getPartnerReferralSignupVariables(subordinateNickname)
    const result = await sendAlimtalkToOne(templateCode, referrerPhoneNumber, variables)
    return { success: true, messageKey: result.messageKey }
  } catch (error: any) {
    console.error('[Alimtalk] 하위 파트너 가입 알림톡 발송 실패:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * 정산 내역 도착 알림톡 발송
 * - 파트너에게 발송
 */
export async function sendPartnerSettlementAlimtalk(
  phoneNumber: string
): Promise<SendResult> {
  const templateCode = ALIMTALK_TEMPLATES.PARTNER_SETTLEMENT

  try {
    const variables = getPartnerSettlementVariables()
    const result = await sendAlimtalkToOne(templateCode, phoneNumber, variables)
    return { success: true, messageKey: result.messageKey }
  } catch (error: any) {
    console.error('[Alimtalk] 정산 내역 알림톡 발송 실패:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * 새로운 상담 문의 알림톡 발송
 * - 파트너에게 발송
 */
export async function sendPartnerNewInquiryAlimtalk(
  phoneNumber: string
): Promise<SendResult> {
  const templateCode = ALIMTALK_TEMPLATES.PARTNER_NEW_INQUIRY

  try {
    const variables = getPartnerNewInquiryVariables()
    const result = await sendAlimtalkToOne(templateCode, phoneNumber, variables)
    return { success: true, messageKey: result.messageKey }
  } catch (error: any) {
    console.error('[Alimtalk] 새 문의 알림톡 발송 실패:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * 계약 성공 알림톡 발송
 * - 파트너에게 발송
 */
export async function sendPartnerContractSuccessAlimtalk(
  phoneNumber: string
): Promise<SendResult> {
  const templateCode = ALIMTALK_TEMPLATES.PARTNER_CONTRACT_SUCCESS

  try {
    const variables = getPartnerContractSuccessVariables()
    const result = await sendAlimtalkToOne(templateCode, phoneNumber, variables)
    return { success: true, messageKey: result.messageKey }
  } catch (error: any) {
    console.error('[Alimtalk] 계약 성공 알림톡 발송 실패:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * 상담 취소 알림톡 발송
 * - 파트너에게 발송
 */
export async function sendPartnerInquiryCancelledAlimtalk(
  phoneNumber: string
): Promise<SendResult> {
  const templateCode = ALIMTALK_TEMPLATES.PARTNER_INQUIRY_CANCELLED

  try {
    const variables = getPartnerInquiryCancelledVariables()
    const result = await sendAlimtalkToOne(templateCode, phoneNumber, variables)
    return { success: true, messageKey: result.messageKey }
  } catch (error: any) {
    console.error('[Alimtalk] 상담 취소 알림톡 발송 실패:', error.message)
    return { success: false, error: error.message }
  }
}
