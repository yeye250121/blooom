'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 로그인 페이지로 리다이렉트
    router.push('/partners/login')
  }, [router])

  return null
}
