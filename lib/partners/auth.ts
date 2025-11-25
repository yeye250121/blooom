import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export interface UserContext {
  id: string
  loginId: string
  uniqueCode: string
  nickname: string
  level: number
}

/**
 * JWT 토큰에서 사용자 정보 추출
 */
export function getUserContext(request: NextRequest): UserContext | null {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserContext

    if (!decoded?.uniqueCode || typeof decoded.uniqueCode !== 'string') {
      return null
    }

    return {
      id: decoded.id,
      loginId: decoded.loginId,
      uniqueCode: decoded.uniqueCode,
      nickname: decoded.nickname,
      level: decoded.level,
    }
  } catch (error) {
    console.error('[Auth] 토큰 검증 실패:', error)
    return null
  }
}

/**
 * JWT 토큰 생성
 */
export function generateToken(user: UserContext): string {
  return jwt.sign(
    {
      id: user.id,
      loginId: user.loginId,
      uniqueCode: user.uniqueCode,
      nickname: user.nickname,
      level: user.level,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}
