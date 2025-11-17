import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

interface AdminContext {
  id: string
  uniqueCode: string
}

/**
 * 관리자 인증은 이제 로그인한 사용자의 고유 코드가 S로 시작하는지 확인하는 방식으로 바뀌었습니다.
 * 사내 카드키를 찍고 VIP 라운지로 들어가는 장면을 떠올리면 이해가 쉽습니다.
 */
export function getAdminContext(request: NextRequest): AdminContext | null {
  const authHeader = request.headers.get('authorization')

  console.log('[Admin Auth] Authorization 헤더:', authHeader ? authHeader.substring(0, 50) + '...' : 'null')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[Admin Auth] Authorization 헤더 없음 또는 잘못된 형식')
    return null
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    console.log('[Admin Auth] 토큰 디코딩 성공:', {
      id: decoded.id,
      uniqueCode: decoded.uniqueCode,
      loginId: decoded.loginId,
    })

    if (!decoded?.uniqueCode || typeof decoded.uniqueCode !== 'string') {
      console.log('[Admin Auth] uniqueCode 없음 또는 잘못된 타입')
      return null
    }

    if (!decoded.uniqueCode.startsWith('S')) {
      console.log('[Admin Auth] S 코드가 아님:', decoded.uniqueCode)
      return null
    }

    console.log('[Admin Auth] 관리자 인증 성공')
    return {
      id: decoded.id,
      uniqueCode: decoded.uniqueCode,
    }
  } catch (error) {
    console.error('[Admin Auth] 토큰 검증 실패:', error)
    return null
  }
}

