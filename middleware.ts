import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 파트너 페이지 보호 (login, register 제외)
  if (
    pathname.startsWith('/partners') &&
    !pathname.startsWith('/partners/login') &&
    !pathname.startsWith('/partners/register')
  ) {
    const token = request.cookies.get('partner-token')?.value

    if (!token) {
      const loginUrl = new URL('/partners/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 관리자 페이지 보호 (login 제외)
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login')
  ) {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/partners/:path*', '/admin/:path*'],
}
