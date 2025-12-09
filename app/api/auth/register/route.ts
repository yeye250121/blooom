import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

// 고유 코드 자동 생성 함수
async function generateUniqueCode(referrerCode?: string): Promise<string> {
  let prefix = 'A' // 기본값: 추천인 없으면 A

  if (referrerCode) {
    // 추천인 코드의 첫 글자를 가져와서 다음 레벨로 증가
    const referrerPrefix = referrerCode.charAt(0)

    // S 코드는 특별 코드이므로 추천인으로 사용 불가
    if (referrerPrefix === 'S') {
      throw new Error('S 코드는 추천인 코드로 사용할 수 없습니다')
    }

    // A -> B, B -> C, C -> D ... 순서로 증가
    const nextCharCode = referrerPrefix.charCodeAt(0) + 1

    // Z를 넘어가면 에러
    if (nextCharCode > 90) { // 'Z'의 charCode는 90
      throw new Error('코드 레벨이 최대치에 도달했습니다')
    }

    prefix = String.fromCharCode(nextCharCode)
  }

  // 해당 prefix로 시작하는 코드 중 가장 큰 번호 찾기
  const { data: existingCodes } = await supabase
    .from('users')
    .select('unique_code')
    .like('unique_code', `${prefix}%`)
    .order('unique_code', { ascending: false })
    .limit(1)

  let nextNumber = 1

  if (existingCodes && existingCodes.length > 0) {
    // 기존 코드에서 숫자 부분 추출
    const lastCode = existingCodes[0].unique_code
    const lastNumber = parseInt(lastCode.substring(1))
    nextNumber = lastNumber + 1
  }

  return `${prefix}${String(nextNumber).padStart(5, '0')}`
}

export async function POST(request: NextRequest) {
  try {
    const { loginId, password, nickname, phone, referrerCode, level = 1 } = await request.json()
    // 추천인 코드를 미리 정돈해두면, 고객명부를 정리할 때 이름을 예쁘게 써 넣는 것처럼 이후 로직이 깔끔해집니다.
    const normalizedReferrerCode = referrerCode?.trim().toUpperCase()

    if (!loginId || !password || !nickname || !phone) {
      return NextResponse.json(
        { message: '아이디, 비밀번호, 닉네임, 휴대폰 번호를 입력해주세요' },
        { status: 400 }
      )
    }

    // 전화번호 형식 검증
    const phoneRegex = /^01[0-9]{8,9}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { message: '올바른 휴대폰 번호를 입력해주세요' },
        { status: 400 }
      )
    }

    // 로그인 ID 중복 체크
    const { data: existingUser } = await supabase
      .from('users')
      .select('login_id')
      .eq('login_id', loginId)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { message: '이미 사용중인 로그인 ID입니다' },
        { status: 409 }
      )
    }

    // 추천인 코드 검증 (있는 경우에만)
    if (normalizedReferrerCode) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id, unique_code')
        .eq('unique_code', normalizedReferrerCode)
        .single()

      if (!referrer) {
        return NextResponse.json(
          { message: '유효하지 않은 추천인 코드입니다' },
          { status: 400 }
        )
      }

      // S 코드는 추천인으로 사용 불가
      if (referrer.unique_code.startsWith('S')) {
        return NextResponse.json(
          { message: 'S 코드는 추천인 코드로 사용할 수 없습니다' },
          { status: 400 }
        )
      }
    }

    // 고유 코드 자동 생성 (추천인 코드 기반)
    const uniqueCode = await generateUniqueCode(normalizedReferrerCode)

    // 비밀번호 해싱
    const passwordHash = await bcrypt.hash(password, 10)

    // 사용자 생성
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          login_id: loginId,
          password_hash: passwordHash,
          nickname,
          phone,
          unique_code: uniqueCode,
          // referrer_code는 가계도에서 부모 노드를 기록하듯 상위 파트너를 추적하기 위한 정보입니다.
          referrer_code: normalizedReferrerCode || null,
          level,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('회원가입 오류:', error)
      return NextResponse.json(
        { message: '회원가입에 실패했습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: '회원가입이 완료되었습니다',
        user: {
          id: newUser.id,
          loginId: newUser.login_id,
          nickname: newUser.nickname,
          uniqueCode: newUser.unique_code,
          level: newUser.level,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('회원가입 오류:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
