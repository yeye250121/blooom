/**
 * 알림톡 발송 서비스
 *
 * 각 비즈니스 시나리오에 맞는 알림톡 발송 함수 제공
 */

import { sendAlimtalkToOne } from './ppurio'
import {
  ALIMTALK_TEMPLATES,
  getSignupCompleteVariables,
  getNewInquiryVariables,
  getInquiryStatusChangedVariables,
  getSettlementRegisteredVariables,
  getSettlementCompletedVariables,
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
 */
export async function sendPartnerSignupAlimtalk(
  phoneNumber: string,
  partnerName: string
): Promise<SendResult> {
  const templateCode = ALIMTALK_TEMPLATES.PARTNER_SIGNUP_COMPLETE

  if (!templateCode) {
    console.log('[Alimtalk] PARTNER_SIGNUP_COMPLETE 템플릿 코드 미설정')
    return { success: false, error: '템플릿 코드 미설정' }
  }

  try {
    const variables = getSignupCompleteVariables(partnerName)
    const result = await sendAlimtalkToOne(templateCode, phoneNumber, variables)
    return { success: true, messageKey: result.messageKey }
  } catch (error: any) {
    console.error('[Alimtalk] 회원가입 알림톡 발송 실패:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * 새 문의 접수 알림톡 발송
 */
export async function sendNewInquiryAlimtalk(
  phoneNumber: string,
  partnerName: string,
  customerName: string,
  customerPhone: string,
  inquiryDate: string
): Promise<SendResult> {
  const templateCode = ALIMTALK_TEMPLATES.PARTNER_NEW_INQUIRY

  if (!templateCode) {
    console.log('[Alimtalk] PARTNER_NEW_INQUIRY 템플릿 코드 미설정')
    return { success: false, error: '템플릿 코드 미설정' }
  }

  try {
    const variables = getNewInquiryVariables(partnerName, customerName, customerPhone, inquiryDate)
    const result = await sendAlimtalkToOne(templateCode, phoneNumber, variables)
    return { success: true, messageKey: result.messageKey }
  } catch (error: any) {
    console.error('[Alimtalk] 새 문의 알림톡 발송 실패:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * 문의 상태 변경 알림톡 발송
 */
export async function sendInquiryStatusChangedAlimtalk(
  phoneNumber: string,
  partnerName: string,
  customerName: string,
  newStatus: string,
  changedDate: string
): Promise<SendResult> {
  const templateCode = ALIMTALK_TEMPLATES.PARTNER_INQUIRY_STATUS_CHANGED

  if (!templateCode) {
    console.log('[Alimtalk] PARTNER_INQUIRY_STATUS_CHANGED 템플릿 코드 미설정')
    return { success: false, error: '템플릿 코드 미설정' }
  }

  try {
    const variables = getInquiryStatusChangedVariables(partnerName, customerName, newStatus, changedDate)
    const result = await sendAlimtalkToOne(templateCode, phoneNumber, variables)
    return { success: true, messageKey: result.messageKey }
  } catch (error: any) {
    console.error('[Alimtalk] 상태 변경 알림톡 발송 실패:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * 정산 등록 알림톡 발송
 */
export async function sendSettlementRegisteredAlimtalk(
  phoneNumber: string,
  partnerName: string,
  settlementMonth: string,
  totalAmount: string,
  settlementDate: string
): Promise<SendResult> {
  const templateCode = ALIMTALK_TEMPLATES.PARTNER_SETTLEMENT_REGISTERED

  if (!templateCode) {
    console.log('[Alimtalk] PARTNER_SETTLEMENT_REGISTERED 템플릿 코드 미설정')
    return { success: false, error: '템플릿 코드 미설정' }
  }

  try {
    const variables = getSettlementRegisteredVariables(partnerName, settlementMonth, totalAmount, settlementDate)
    const result = await sendAlimtalkToOne(templateCode, phoneNumber, variables)
    return { success: true, messageKey: result.messageKey }
  } catch (error: any) {
    console.error('[Alimtalk] 정산 등록 알림톡 발송 실패:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * 정산 완료 알림톡 발송
 */
export async function sendSettlementCompletedAlimtalk(
  phoneNumber: string,
  partnerName: string,
  settlementMonth: string,
  totalAmount: string,
  completedDate: string
): Promise<SendResult> {
  const templateCode = ALIMTALK_TEMPLATES.PARTNER_SETTLEMENT_COMPLETED

  if (!templateCode) {
    console.log('[Alimtalk] PARTNER_SETTLEMENT_COMPLETED 템플릿 코드 미설정')
    return { success: false, error: '템플릿 코드 미설정' }
  }

  try {
    const variables = getSettlementCompletedVariables(partnerName, settlementMonth, totalAmount, completedDate)
    const result = await sendAlimtalkToOne(templateCode, phoneNumber, variables)
    return { success: true, messageKey: result.messageKey }
  } catch (error: any) {
    console.error('[Alimtalk] 정산 완료 알림톡 발송 실패:', error.message)
    return { success: false, error: error.message }
  }
}
