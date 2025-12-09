/**
 * 뿌리오 카카오 알림톡 API 클라이언트
 * https://www.ppurio.com
 */

const PPURIO_BASE_URL = 'https://message.ppurio.com'
const PPURIO_ACCOUNT = process.env.PPURIO_ACCOUNT || ''
const PPURIO_API_KEY = process.env.PPURIO_API_KEY || ''
const PPURIO_SENDER_PROFILE = process.env.PPURIO_SENDER_PROFILE || ''

// 토큰 캐싱 (24시간 유효)
let cachedToken: string | null = null
let tokenExpiry: number = 0

interface TokenResponse {
  token: string
  type: string
  expired: number
}

interface KakaoSendTarget {
  to: string // 수신 번호
  name?: string // [*이름*] 치환 문구
  changeWord?: {
    var1?: string
    var2?: string
    var3?: string
    var4?: string
    var5?: string
    var6?: string
    var7?: string
    var8?: string
  }
}

interface KakaoSendRequest {
  account: string
  messageType: 'ALT' | 'ALL' | 'ALH' | 'ALI' // ALT: 알림톡(텍스트)
  senderProfile: string
  templateCode: string
  duplicateFlag: 'Y' | 'N'
  isResend: 'Y' | 'N'
  targetCount: number
  targets: KakaoSendTarget[]
  refKey: string
  sendTime?: string // 예약 발송 시간 yyyy-MM-ddTHH:mm:ss
  resend?: {
    messageType: 'SMS' | 'LMS' | 'MMS'
    content: string
    from: string
    subject?: string
  }
}

interface KakaoSendResponse {
  code: number
  description: string
  refKey?: string
  messageKey?: string
}

/**
 * 랜덤 refKey 생성 (32자 이내)
 */
function generateRefKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 액세스 토큰 발급
 * 토큰 유효기간: 24시간
 */
async function getAccessToken(): Promise<string> {
  // 캐싱된 토큰이 유효하면 재사용
  if (cachedToken && tokenExpiry > Date.now()) {
    return cachedToken
  }

  const basicAuth = Buffer.from(`${PPURIO_ACCOUNT}:${PPURIO_API_KEY}`).toString('base64')

  const response = await fetch(`${PPURIO_BASE_URL}/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${basicAuth}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('[Ppurio] Token error:', error)
    throw new Error(`뿌리오 토큰 발급 실패: ${error.description || response.statusText}`)
  }

  const data: TokenResponse = await response.json()

  // 토큰 캐싱 (만료 1시간 전까지 유효하게 설정)
  cachedToken = data.token
  tokenExpiry = Date.now() + (23 * 60 * 60 * 1000) // 23시간

  return data.token
}

/**
 * 카카오 알림톡 발송
 */
export async function sendKakaoAlimtalk(
  templateCode: string,
  targets: KakaoSendTarget[],
  options?: {
    sendTime?: string // 예약 발송
    resendSms?: {
      content: string
      from: string
    }
  }
): Promise<KakaoSendResponse> {
  if (!PPURIO_ACCOUNT || !PPURIO_API_KEY || !PPURIO_SENDER_PROFILE) {
    throw new Error('뿌리오 환경변수가 설정되지 않았습니다.')
  }

  const token = await getAccessToken()

  const requestBody: KakaoSendRequest = {
    account: PPURIO_ACCOUNT,
    messageType: 'ALT', // 알림톡(텍스트)
    senderProfile: PPURIO_SENDER_PROFILE,
    templateCode,
    duplicateFlag: 'N',
    isResend: options?.resendSms ? 'Y' : 'N',
    targetCount: targets.length,
    targets,
    refKey: generateRefKey(),
  }

  if (options?.sendTime) {
    requestBody.sendTime = options.sendTime
  }

  if (options?.resendSms) {
    requestBody.resend = {
      messageType: 'SMS',
      content: options.resendSms.content,
      from: options.resendSms.from,
    }
  }

  console.log('[Ppurio] Sending alimtalk:', {
    templateCode,
    targetCount: targets.length,
    targets: targets.map(t => ({ to: t.to.slice(0, 7) + '****' })), // 번호 마스킹
  })

  const response = await fetch(`${PPURIO_BASE_URL}/v1/kakao`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  })

  const data: KakaoSendResponse = await response.json()

  if (data.code !== 1000) {
    console.error('[Ppurio] Send error:', data)
    throw new Error(`알림톡 발송 실패: ${data.description}`)
  }

  console.log('[Ppurio] Send success:', { messageKey: data.messageKey, refKey: data.refKey })

  return data
}

/**
 * 단일 수신자 알림톡 발송 헬퍼
 */
export async function sendAlimtalkToOne(
  templateCode: string,
  phoneNumber: string,
  variables?: {
    name?: string
    var1?: string
    var2?: string
    var3?: string
    var4?: string
    var5?: string
    var6?: string
    var7?: string
    var8?: string
  }
): Promise<KakaoSendResponse> {
  const target: KakaoSendTarget = {
    to: phoneNumber.replace(/-/g, ''), // 하이픈 제거
  }

  if (variables?.name) {
    target.name = variables.name
  }

  const changeWord: KakaoSendTarget['changeWord'] = {}
  if (variables?.var1) changeWord.var1 = variables.var1
  if (variables?.var2) changeWord.var2 = variables.var2
  if (variables?.var3) changeWord.var3 = variables.var3
  if (variables?.var4) changeWord.var4 = variables.var4
  if (variables?.var5) changeWord.var5 = variables.var5
  if (variables?.var6) changeWord.var6 = variables.var6
  if (variables?.var7) changeWord.var7 = variables.var7
  if (variables?.var8) changeWord.var8 = variables.var8

  if (Object.keys(changeWord).length > 0) {
    target.changeWord = changeWord
  }

  return sendKakaoAlimtalk(templateCode, [target])
}
