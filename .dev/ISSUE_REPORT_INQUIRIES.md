# 🐛 문의 관리 페이지 데이터 미표시 문제 보고서

**작성일**: 2025-11-12
**상태**: 🔴 진행 중
**우선순위**: 높음

---

## 📋 목차

1. [문제 요약](#문제-요약)
2. [프로젝트 개요](#프로젝트-개요)
3. [문제 상세](#문제-상세)
4. [환경 차이](#환경-차이)
5. [기술 스택 및 아키텍처](#기술-스택-및-아키텍처)
6. [데이터 플로우](#데이터-플로우)
7. [발견된 문제들](#발견된-문제들)
8. [수정 완료된 항목](#수정-완료된-항목)
9. [현재 상황](#현재-상황)
10. [가능한 원인 분석](#가능한-원인-분석)
11. [다음 조치 사항](#다음-조치-사항)

---

## 🎯 문제 요약

**증상**: 파트너 대시보드의 "문의 관리" 페이지(`/partners/dashboard/leads`)에서 inquiry 데이터가 로컬 환경에서는 정상 표시되지만, Vercel 배포 환경에서는 표시되지 않음.

**영향 범위**: 모든 파트너 사용자의 리드 데이터 확인 불가

---

## 📚 프로젝트 개요

### Blooom - N-Level 마케팅 네트워크 플랫폼

**프로젝트 구조**:
```
blooom/
├── blooom-main/              # 메인 프로젝트 (Next.js 14)
│   ├── app/
│   │   ├── landing/          # KT CCTV 상담 신청 랜딩 페이지
│   │   ├── partners/         # 파트너 시스템
│   │   │   └── dashboard/
│   │   │       └── leads/    # ⚠️ 문제 발생 페이지
│   │   └── api/
│   │       └── inquiries/    # 문의 조회 API
│   └── lib/supabase.ts       # Supabase 클라이언트
```

**핵심 기능**:
- **랜딩 페이지**: 고객이 상담 신청 (마케터 코드와 함께 저장)
- **파트너 대시보드**: 마케터가 자신의 코드로 유입된 문의 확인

---

## 🔍 문제 상세

### 증상

#### ✅ 로컬 환경 (http://localhost:3000)
- `/partners/dashboard/leads` 접속
- inquiries 테이블 데이터 정상 표시
- API 호출 성공
- 문의 목록 정상 렌더링

#### ❌ 배포 환경 (https://www.blooom.kr)
- `/partners/dashboard/leads` 접속
- "아직 문의가 없습니다" 메시지만 표시
- API는 200 OK 응답하지만 데이터 0개
- Vercel 로그: `Filtered query result: { count: 0, inquiriesLength: 0 }`

---

## 🌍 환경 차이

| 항목 | 로컬 환경 | 배포 환경 (Vercel) |
|------|----------|-------------------|
| URL | http://localhost:3000 | https://www.blooom.kr |
| 데이터베이스 | Supabase (동일) | Supabase (동일) |
| 환경 변수 | .env.local | Vercel 환경 변수 설정됨 ✅ |
| 빌드 모드 | development | production |
| 데이터 표시 | ✅ 정상 | ❌ 0건 |

---

## 🛠️ 기술 스택 및 아키텍처

### 프론트엔드
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **상태 관리**: Zustand (인증 상태)
- **HTTP Client**: Axios

### 백엔드
- **Database**: Supabase (PostgreSQL)
- **API**: Next.js API Routes
- **인증**: JWT (jsonwebtoken)

### 배포
- **Platform**: Vercel
- **환경 변수**: Vercel Dashboard에서 설정 완료

---

## 🔄 데이터 플로우

### 1. 상담 신청 플로우
```
고객 → 랜딩 페이지 (landing?code=ABC123)
     → 상담 신청 폼 제출
     → /api/inquiry (POST)
     → inquiries 테이블에 저장 (marketer_code = 'ABC123')
```

### 2. 문의 조회 플로우
```
파트너 로그인 → /partners/dashboard/leads 접속
              → useEffect로 fetchInquiries() 호출
              → api.get('/api/inquiries?page=1&limit=10')
              → Axios interceptor가 JWT 토큰 추가
              → API Route: /api/inquiries (GET)
              → 1. JWT 검증
              → 2. users 테이블에서 unique_code 조회
              → 3. inquiries 테이블에서 marketer_code 매칭
              → 4. 필터링된 결과 반환
              → 프론트엔드에서 테이블 렌더링
```

---

## 🔎 발견된 문제들

### 1. React Hydration 에러 (✅ 수정 완료)

**브라우저 콘솔 에러**:
```
Uncaught Error: Minified React error #418
Uncaught Error: Minified React error #423
```

**원인**:
`/app/partners/dashboard/leads/page.tsx:88`

```typescript
const landingUrl = `${window.location.origin}/${user?.uniqueCode}`
```

- 서버 사이드 렌더링 중에 `window` 객체 참조
- 서버에는 `window`가 없어 hydration 불일치 발생

**영향**:
- React 컴포넌트 렌더링 오류
- API 호출 및 데이터 표시에 영향 가능성

---

### 2. API는 정상 작동하지만 데이터 0건

**Vercel 로그**:
```
Nov 11 23:13:59.38
GET 200
www.blooom.kr/api/inquiries
Filtered query result: { count: 0, inquiriesLength: 0 }
```

**API 응답 분석**:
- HTTP 상태 코드: `200 OK` ✅
- 인증: 통과 ✅ (401 에러 아님)
- JWT 검증: 성공 ✅
- 쿼리 실행: 성공 ✅
- **하지만 결과: 0건** ❌

**Network 탭 확인**:
```
Request URL: https://www.blooom.kr/api/inquiries?page=1&limit=10
Request Method: GET
Status Code: 200 OK

Request Headers:
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response Body:
{
  "inquiries": [],
  "total": 0,
  "page": 1,
  "limit": 10,
  "totalPages": 0
}
```

---

### 3. 간헐적 401 Unauthorized

**Vercel 로그**:
```
Nov 11 23:31:18.60
GET 401
www.blooom.kr/api/inquiries
```

- 일부 요청에서 401 에러 발생
- 토큰 만료 또는 localStorage 동기화 문제 가능성

---

## ✅ 수정 완료된 항목

### 1. Hydration 에러 수정

**파일**: `/app/partners/dashboard/leads/page.tsx:88-90`

**수정 전**:
```typescript
const landingUrl = `${window.location.origin}/${user?.uniqueCode}`
```

**수정 후**:
```typescript
const landingUrl = typeof window !== 'undefined'
  ? `${window.location.origin}/${user?.uniqueCode}`
  : ''
```

**추가 변경**:
```typescript
{landingUrl && (
  <p className="mt-2 text-sm text-gray-600">
    내 랜딩페이지: <span className="font-mono text-blue-600">
      {landingUrl}
    </span>
    <button onClick={() => copyToClipboard(landingUrl)} ...>
      📋
    </button>
  </p>
)}
```

**커밋**: `c3065dc` - "Fix hydration error and add debug API"

---

### 2. 디버깅 API 추가

**파일**: `/app/api/debug-inquiries/route.ts` (신규 생성)

**목적**: 배포 환경에서 데이터 상태 진단

**기능**:
- 로그인한 사용자의 `unique_code` 확인
- DB의 전체 inquiries 샘플 조회
- 사용자별 필터링된 inquiries 조회
- marketer_code 매칭 상태 확인

**엔드포인트**: `GET /api/debug-inquiries`

**응답 예시**:
```json
{
  "success": true,
  "user": {
    "id": "8da4eb18-a33b-41c6-b6a8-f4538ff91bf3",
    "login_id": "test11",
    "unique_code": "ABC123",
    "level": 1
  },
  "allInquiries": {
    "count": 10,
    "sample": [
      { "id": "...", "marketer_code": "ABC123", "phone_number": "1234" },
      { "id": "...", "marketer_code": "DEF456", "phone_number": "5678" }
    ]
  },
  "myInquiries": {
    "count": 5,
    "sample": [...]
  },
  "comparison": {
    "userCode": "ABC123",
    "matchingCodes": 5
  }
}
```

**커밋**: `c3065dc` - "Fix hydration error and add debug API"

---

### 3. 대시보드 네비게이션 링크 수정

**파일**: `/app/partners/dashboard/page.tsx:42-68`

**문제**: 주요 기능 바로가기 링크가 잘못된 경로 사용

**수정**:
- `/dashboard/leads` → `/partners/dashboard/leads`
- `/dashboard/network` → `/partners/dashboard/network`
- `/dashboard/commissions` → `/partners/dashboard/commissions`
- `/dashboard/education` → `/partners/dashboard/education`

**커밋**: `0708065` - "Fix dashboard navigation links"

---

## 📊 현재 상황

### API 코드 분석

**파일**: `/app/api/inquiries/route.ts:36-72`

**핵심 로직**:
```typescript
// 1. JWT에서 사용자 ID 추출
const decoded: any = jwt.verify(token, JWT_SECRET)

// 2. users 테이블에서 unique_code 조회
const { data: user } = await supabase
  .from('users')
  .select('unique_code')
  .eq('id', decoded.id)
  .single()

console.log('User unique_code:', user.unique_code)

// 3. 디버깅: 모든 문의의 marketer_code 샘플 확인
const { data: allInquiries } = await supabase
  .from('inquiries')
  .select('id, marketer_code')
  .limit(5)

console.log('Sample marketer_codes from DB:',
  allInquiries?.map(i => `"${i.marketer_code}"`)
)

// 4. 본인의 marketer_code로 필터링
const { data: inquiries, error, count } = await supabase
  .from('inquiries')
  .select('*', { count: 'exact' })
  .eq('marketer_code', user.unique_code)  // ⚠️ 여기서 매칭 실패 가능성
  .order('submitted_at', { ascending: false })
  .range(offset, offset + limit - 1)

console.log('Filtered query result:',
  { count, inquiriesLength: inquiries?.length }
)
```

### Vercel 로그 출력

**확인된 내용**:
```
Filtered query result: { count: 0, inquiriesLength: 0 }
```

**확인 필요 (로그에서 누락)**:
- `User unique_code: ???` ← 이 값이 무엇인지 확인 필요
- `Sample marketer_codes from DB: [...]` ← DB에 실제 어떤 코드들이 있는지
- `Comparing with user code: ???` ← 매칭 비교 결과

---

### 데이터베이스 스키마

**inquiries 테이블**:
```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY,
  referrer_url TEXT,
  phone_number TEXT NOT NULL,
  install_location TEXT NOT NULL,
  install_count INTEGER NOT NULL,
  privacy_consent BOOLEAN DEFAULT true,
  marketer_code TEXT,              -- ⚠️ 핵심 필드
  submitted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**users 테이블**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  login_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT NOT NULL,
  unique_code TEXT UNIQUE NOT NULL,  -- ⚠️ 핵심 필드
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🤔 가능한 원인 분석

### 원인 1: 로컬과 배포 환경이 다른 Supabase 프로젝트를 사용 ⭐⭐⭐⭐⭐

**가능성**: 매우 높음

**설명**:
- 로컬 `.env.local`: 개발용 Supabase 프로젝트 (데이터 있음)
- Vercel 환경 변수: 프로덕션용 Supabase 프로젝트 (데이터 없음)

**확인 방법**:
```bash
# 로컬
echo $NEXT_PUBLIC_SUPABASE_URL
# → https://xxx.supabase.co

# Vercel 환경 변수
# → https://yyy.supabase.co  (다를 수 있음)
```

**해결 방법**:
1. Vercel 환경 변수가 올바른 Supabase URL을 가리키는지 확인
2. 또는 프로덕션 Supabase에 데이터 마이그레이션

---

### 원인 2: marketer_code 값 불일치 (공백, 대소문자 등) ⭐⭐⭐⭐

**가능성**: 높음

**시나리오**:
```typescript
// users 테이블
unique_code = "ABC123"

// inquiries 테이블
marketer_code = "abc123"    // 소문자
marketer_code = "ABC123 "   // 뒤 공백
marketer_code = " ABC123"   // 앞 공백
marketer_code = null        // null 값
```

**확인 방법**:
Supabase 대시보드에서 직접 쿼리:
```sql
-- 사용자 코드 확인
SELECT id, login_id, unique_code, length(unique_code) as code_length
FROM users
WHERE login_id = 'test11';

-- 문의 데이터 확인
SELECT id, marketer_code, length(marketer_code) as code_length, phone_number
FROM inquiries
LIMIT 10;

-- 매칭 여부 확인
SELECT
  u.unique_code as user_code,
  i.marketer_code as inquiry_code,
  u.unique_code = i.marketer_code as is_match
FROM users u
CROSS JOIN inquiries i
WHERE u.login_id = 'test11'
LIMIT 10;
```

**해결 방법**:
- 대소문자 통일
- 공백 제거 (TRIM 함수)
- NULL 처리

---

### 원인 3: Row Level Security (RLS) 정책 ⭐⭐⭐

**가능성**: 중간

**설명**:
Supabase의 RLS 정책이 배포 환경에서 다르게 적용될 수 있음

**스키마 파일 확인** (`supabase-schema.sql:44-49`):
```sql
-- 인증된 사용자만 문의를 조회할 수 있음
CREATE POLICY "Authenticated users can view inquiries"
  ON inquiries
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

**문제**:
- Supabase 클라이언트가 `anon` 키 사용
- RLS가 `auth.role() = 'authenticated'` 체크
- Service Role Key가 아니면 인증 실패 가능

**확인 방법**:
```typescript
// lib/supabase.ts
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```

**해결 방법**:
- Service Role Key 사용 (서버 사이드에서만)
- 또는 RLS 정책 수정

---

### 원인 4: Supabase 클라이언트 설정 문제 ⭐⭐

**가능성**: 낮음

**코드** (`lib/supabase.ts`):
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**문제 가능성**:
- 환경 변수 누락
- 잘못된 키 값
- 네트워크 연결 문제

---

### 원인 5: 데이터가 실제로 없음 ⭐

**가능성**: 낮음 (로컬에서는 보이므로)

**확인**:
Supabase 대시보드 → Table Editor → inquiries 테이블에 실제 데이터가 있는지

---

## 🚀 다음 조치 사항

### 🔴 긴급 (즉시 수행)

#### 1. Supabase 프로젝트 확인
**Vercel 환경 변수**:
1. Vercel Dashboard → 프로젝트 → Settings → Environment Variables
2. `NEXT_PUBLIC_SUPABASE_URL` 값 복사
3. Supabase 대시보드에서 해당 프로젝트 접속
4. Table Editor → inquiries 테이블에 데이터가 있는지 확인

**예상 결과**:
- 데이터 있음 → 다음 단계로
- **데이터 없음** → 로컬과 다른 프로젝트 사용 중 (환경 변수 수정 필요)

#### 2. Supabase 대시보드에서 직접 쿼리 실행

```sql
-- 1. 사용자 정보 확인
SELECT id, login_id, unique_code,
       length(unique_code) as code_length,
       quote_literal(unique_code) as quoted_code
FROM users
WHERE login_id = 'test11';

-- 2. 문의 데이터 확인
SELECT id, marketer_code,
       length(marketer_code) as code_length,
       quote_literal(marketer_code) as quoted_code,
       phone_number
FROM inquiries
ORDER BY created_at DESC
LIMIT 10;

-- 3. 매칭 테스트
SELECT COUNT(*) as matching_count
FROM inquiries
WHERE marketer_code = 'ABC123';  -- test11 사용자의 실제 코드로 변경
```

#### 3. 디버그 API 접근 (우회 방법)

**방법 1: 새 디버그 엔드포인트 (인증 없이)**

임시로 인증 없는 디버깅 API를 만들어서 확인:

```typescript
// app/api/debug-simple/route.ts
export async function GET() {
  const { data: users } = await supabase.from('users').select('*').limit(3)
  const { data: inquiries } = await supabase.from('inquiries').select('*').limit(3)

  return NextResponse.json({
    users: users?.map(u => ({ id: u.id, login_id: u.login_id, unique_code: u.unique_code })),
    inquiries: inquiries?.map(i => ({ id: i.id, marketer_code: i.marketer_code }))
  })
}
```

**방법 2: Vercel 로그 더 자세히 확인**

Vercel Dashboard → Deployments → 최신 배포 → Functions → `/api/inquiries` → 개별 요청 클릭
- `User unique_code` 로그 찾기
- `Sample marketer_codes` 로그 찾기

---

### 🟡 중요 (1-2일 내)

#### 4. RLS 정책 검토

Supabase Dashboard → Authentication → Policies → inquiries 테이블
- 현재 정책 확인
- Service Role Key 사용 고려

#### 5. 에러 핸들링 개선

현재 코드는 에러를 알람으로만 표시:
```typescript
catch (error: any) {
  alert(error.response?.data?.message || '문의 목록을 불러오는데 실패했습니다')
}
```

개선:
- 상세 에러 메시지 표시
- Sentry 등 에러 트래킹 도구 연동
- 사용자에게 더 명확한 피드백

#### 6. 데이터 정합성 검사

- `marketer_code` 필드 NOT NULL 제약 추가 고려
- 인덱스 추가: `CREATE INDEX idx_inquiries_marketer_code ON inquiries(marketer_code);`
- 대소문자 통일 및 공백 제거 마이그레이션

---

### 🟢 개선 (향후)

#### 7. 테스트 환경 구축
- E2E 테스트 (Playwright, Cypress)
- 배포 전 자동 테스트

#### 8. 모니터링 강화
- Vercel Analytics 활성화
- Supabase Logs 모니터링
- 사용자 행동 트래킹

#### 9. 로컬-배포 환경 동기화
- 스테이징 환경 추가
- 데이터 시딩 스크립트
- 환경별 설정 문서화

---

## 📞 담당자 및 리소스

### 관련 파일
- `/app/partners/dashboard/leads/page.tsx` - 문의 관리 페이지
- `/app/api/inquiries/route.ts` - 문의 조회 API
- `/app/api/debug-inquiries/route.ts` - 디버깅 API (신규)
- `/lib/supabase.ts` - Supabase 클라이언트
- `/app/partners/lib/api.ts` - Axios 인터셉터

### Git 커밋
- `c3065dc` - Hydration 에러 수정 및 디버깅 API 추가
- `0708065` - 대시보드 네비게이션 링크 수정

### 외부 리소스
- GitHub: https://github.com/yeye250121/blooom.git
- Vercel: https://www.blooom.kr
- Supabase: https://yknptcjxrizgccxczzuy.supabase.co

---

## 📝 추가 메모

### 임시 해결책 (권장하지 않음)
만약 긴급하게 데이터를 확인해야 한다면:
1. Supabase Dashboard에서 직접 SQL 쿼리로 확인
2. RLS 정책을 임시로 비활성화 (보안 주의!)

### 장기적 해결책
1. 환경 변수 관리 시스템 도입 (dotenv-vault 등)
2. 통합 테스트 자동화
3. 배포 전 체크리스트 작성

---

**문서 버전**: 1.0
**마지막 업데이트**: 2025-11-12
**작성자**: Claude Code

---

## 🔄 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|-----------|
| 2025-11-12 | 1.0 | 초기 문서 작성 |
