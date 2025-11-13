# Vercel 배포 가이드

## 🔧 필수 환경 변수 설정

Vercel에 배포하기 전에 반드시 다음 환경 변수들을 설정해야 합니다.

### 1. Supabase Service Role Key 가져오기

**⚠️ 중요:** `SUPABASE_SERVICE_ROLE_KEY`는 RLS (Row Level Security)를 우회하여 모든 데이터에 접근할 수 있는 관리자 키입니다. **절대 클라이언트 코드에 노출되어서는 안 됩니다.**

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **API** 메뉴로 이동
4. **Project API keys** 섹션에서 `service_role` 키 복사
   - `anon` / `public` 키가 **아닙니다**
   - `service_role` (secret) 키를 복사해야 합니다

### 2. Vercel 환경 변수 설정

#### Vercel Dashboard에서 설정하기

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables** 메뉴로 이동
4. 다음 변수들을 추가:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yknptcjxrizgccxczzuy.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Supabase의 anon/public 키) | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | (Supabase의 service_role 키) ⚠️ | Production, Preview, Development |
| `JWT_SECRET` | `blooom_jwt_secret_key_2025_production_change_this` | Production, Preview, Development |

**⚠️ 주의사항:**
- `SUPABASE_SERVICE_ROLE_KEY`는 **절대** `NEXT_PUBLIC_` 접두사를 붙이면 안 됩니다.
- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트에 노출됩니다.
- Service Role Key는 서버 측에서만 사용됩니다.

#### Vercel CLI로 설정하기 (선택사항)

```bash
# Production 환경
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Preview 환경
vercel env add SUPABASE_SERVICE_ROLE_KEY preview

# Development 환경
vercel env add SUPABASE_SERVICE_ROLE_KEY development
```

### 3. 로컬 개발 환경 설정

`.env.local` 파일에서 다음 변수를 업데이트하세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yknptcjxrizgccxczzuy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here  # ⚠️ Supabase Dashboard에서 가져오기
JWT_SECRET=blooom_jwt_secret_key_2025_production_change_this
```

## 🚀 배포하기

환경 변수 설정이 완료되면:

```bash
# Git에 커밋하고 푸시
git add .
git commit -m "Fix: Add service role key for RLS bypass"
git push

# 또는 Vercel CLI 사용
vercel --prod
```

## 🔍 배포 후 확인사항

### 1. 환경 변수 확인

Vercel Dashboard → 프로젝트 → Settings → Environment Variables에서:
- ✅ `SUPABASE_SERVICE_ROLE_KEY`가 설정되어 있는지 확인
- ✅ 키가 `eyJ...`로 시작하는 JWT 형식인지 확인

### 2. API 동작 확인

배포된 앱에서:
- ✅ 로그인 후 대시보드 접속
- ✅ 문의 목록이 정상적으로 표시되는지 확인
- ✅ 브라우저 개발자 도구 → Network 탭에서 API 응답 확인

### 3. Vercel 로그 확인

문제가 있다면:
1. Vercel Dashboard → 프로젝트 → Deployments
2. 최신 배포 클릭
3. **Runtime Logs** 탭에서 에러 확인

예상 로그:
```
User unique_code: ABC123
Sample marketer_codes from DB: ["ABC123", "XYZ789", ...]
Comparing with user code: "ABC123"
Filtered query result: { count: 5, inquiriesLength: 5 }
```

## 🐛 문제 해결

### 문제 1: `Missing env.SUPABASE_SERVICE_ROLE_KEY` 에러

**원인:** Vercel 환경 변수에 키가 설정되지 않았습니다.

**해결:**
1. Vercel Dashboard에서 환경 변수 추가
2. 재배포 (Vercel은 환경 변수 변경 시 자동 재배포되지 않습니다)
3. Deployments → ... → Redeploy 클릭

### 문제 2: 여전히 `count: 0` 반환

**원인 1: RLS 정책 문제**
- Supabase에서 `inquiries` 테이블의 RLS 정책 확인
- `service_role` 키는 RLS를 우회하므로, 이 문제는 해결되어야 합니다.

**원인 2: 데이터 불일치**
- 로그에서 `user.unique_code`와 `marketer_code` 값 비교
- 대소문자, 공백 등 정확히 일치하는지 확인

**원인 3: 데이터베이스 분리**
- 로컬과 프로덕션이 서로 다른 Supabase 프로젝트를 사용 중일 수 있습니다.
- Vercel의 `NEXT_PUBLIC_SUPABASE_URL`이 로컬 `.env.local`과 동일한지 확인

### 문제 3: 502 Bad Gateway 에러

**원인:** 환경 변수가 빌드 타임에 로드되지 않았습니다.

**해결:**
1. Vercel Dashboard → Settings → Environment Variables에서 모든 변수가 **Production, Preview, Development** 환경에 모두 체크되어 있는지 확인
2. Redeploy (재배포)

## 📚 관련 문서

- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js 환경 변수](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel 환경 변수](https://vercel.com/docs/projects/environment-variables)

## 🔒 보안 체크리스트

- ✅ `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- ✅ `SUPABASE_SERVICE_ROLE_KEY`가 Git에 커밋되지 않았는지 확인
- ✅ `SUPABASE_SERVICE_ROLE_KEY`에 `NEXT_PUBLIC_` 접두사가 없는지 확인
- ✅ 프로덕션과 개발 환경에 서로 다른 JWT_SECRET 사용 (권장)
