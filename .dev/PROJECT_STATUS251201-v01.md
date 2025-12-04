# Blooom 프로젝트 현황

> 최종 업데이트: 2025-12-04

## 📋 프로젝트 개요

KT 텔레캅 CCTV 설치 상담/예약 플랫폼으로, 랜딩페이지를 통한 고객 문의 접수와 파트너(마케터) MLM 관리 시스템을 제공합니다.

### 기술 스택
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (서류 이미지 업로드)
- **Editor**: TipTap (가이드 WYSIWYG 에디터)
- **Deployment**: Vercel

---

## 🏗️ 프로젝트 구조

```
app/
├── [code]/                    # 파트너 코드별 랜딩페이지 (동적 라우트)
├── landing/                   # 랜딩페이지
│   ├── components/            # 랜딩 컴포넌트
│   │   └── ReservationForm.tsx  # 예약/상담 폼 (핵심)
│   ├── api/inquiry/           # 문의 등록 API
│   ├── policies/              # 약관 페이지
│   └── types/                 # 타입 정의
│
├── admin/                     # 관리자 페이지
│   ├── login/                 # 관리자 로그인
│   ├── dashboard/             # 대시보드
│   ├── inquiries/             # 문의 관리 ⭐
│   ├── partners/              # 파트너 관리 ⭐
│   ├── guides/                # 가이드 관리
│   └── settlements/           # 정산 관리
│
├── partners/                  # 파트너 페이지
│   ├── login/                 # 파트너 로그인
│   ├── register/              # 파트너 가입
│   ├── home/                  # 파트너 홈
│   ├── inquiries/             # 문의 목록 ⭐
│   ├── guides/                # 가이드 열람
│   ├── settlements/           # 정산 내역
│   └── my/                    # 마이페이지
│
└── api/                       # API 라우트
    ├── admin/                 # 관리자 API
    │   ├── auth/              # 관리자 인증
    │   ├── inquiries/         # 문의 CRUD
    │   └── partners/          # 파트너 CRUD
    ├── auth/                  # 파트너 인증
    ├── partners/              # 파트너 관련
    │   └── subordinates/      # 하위 파트너 조회
    ├── inquiries/             # 문의 CRUD
    ├── reservation/           # 예약 관련
    │   ├── blocked-dates/     # 예약 불가일 관리
    │   └── upload/            # 서류 업로드
    └── guides/                # 가이드 조회
```

---

## 📊 데이터베이스 스키마

### 주요 테이블

#### `inquiries` (문의)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| phone_number | text | 연락처 |
| install_location | text | 설치 위치 |
| install_count | int | 설치 대수 (상담용) |
| marketer_code | text | 담당 파트너 코드 |
| status | text | 상태 (new/in_progress/contracted/cancelled) |
| inquiry_type | text | 유형 (consultation/installation) |
| reservation_date | date | 예약 날짜 |
| reservation_time_slot | text | 시간대 (morning/afternoon) |
| outdoor_count | int | 야외 설치 대수 |
| indoor_count | int | 실내 설치 대수 |
| address | text | 주소 |
| address_detail | text | 상세 주소 |
| zonecode | text | 우편번호 |
| documents | jsonb | 첨부 서류 {idCard: url, paymentCard: url, ...} |
| documents_submitted | boolean | 서류 제출 여부 |
| submitted_at | timestamp | 접수일 |

#### `users` (파트너)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| login_id | text | 로그인 아이디 |
| password | text | 비밀번호 (해시) |
| unique_code | text | 고유 파트너 코드 |
| nickname | text | 닉네임 |
| level | int | 파트너 레벨 (0: S코드/관리자) |
| referrer_code | text | 추천인(상위 파트너) 코드 |
| phone | text | 연락처 |
| bank_name | text | 은행명 |
| account_number | text | 계좌번호 |
| account_holder | text | 예금주 |
| created_at | timestamp | 가입일 |

#### `reservation_blocked_dates` (예약 불가일)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| blocked_date | date | 불가 날짜 |
| reason | text | 사유 |

#### `admins` (관리자)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| username | text | 아이디 |
| password_hash | text | 비밀번호 해시 |

#### `guides` (가이드)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| title | text | 가이드 제목 |
| content | text | 본문 (TipTap JSON/HTML) |
| created_at | timestamp | 생성일 |

---

## ✅ 완료된 기능

### 랜딩페이지
- [x] 상담 신청 폼 (전화번호, 설치위치, 수량)
- [x] 설치 예약 폼 (날짜, 시간, 야외/실내 수량, 주소)
- [x] 서류 첨부 (신분증, 결제수단) - Supabase Storage
- [x] 예약 불가일 캘린더 연동
- [x] 토스 스타일 UI/UX
- [x] 파트너 코드별 동적 라우팅

### 관리자 페이지
- [x] 로그인/인증 (JWT 기반)
- [x] 대시보드 (통계)
- [x] 문의 관리
  - [x] 문의 목록 (유형, 예약일, 상태 필터)
  - [x] 상태 변경 (신규/상담중/계약완료/취소)
  - [x] 서류 확인 (토글 미리보기, 다운로드)
  - [x] 문의 삭제
- [x] 파트너 관리
  - [x] 파트너 목록 조회
  - [x] 파트너 생성 (관리자 직접 등록)
  - [x] 파트너 삭제
  - [x] 민감정보 마스킹 (아이디, 닉네임, 전화번호, 계좌정보)
  - [x] 전화번호 표시
  - [x] 정산계좌 정보 표시 (은행명, 계좌번호, 예금주)
- [x] 가이드 관리
  - [x] TipTap WYSIWYG 에디터
  - [x] 이미지 드래그 앤 드롭 업로드
  - [x] 이미지 클립보드 붙여넣기
  - [x] 이미지에 링크 삽입 (버블 메뉴)
  - [x] 인용구, 구분선 스타일링
  - [x] Google 슬라이드 임베드 기능
  - [x] 슬라이드 전체화면 보기
- [x] 정산 관리

### 파트너 페이지
- [x] 로그인/회원가입
- [x] 홈
  - [x] 본인 문의 현황 (신규/상담중/계약완료/취소)
  - [x] 하위 파트너 목록 및 문의 수 표시
- [x] 문의 목록
  - [x] 본인/하위 파트너 문의 조회
  - [x] 상태/유형 필터
  - [x] 상태 변경 (본인 문의만)
  - [x] 서류 유형 표시 (내용 열람 불가)
- [x] 가이드 열람
- [x] 정산 내역
- [x] 마이페이지
  - [x] 닉네임 변경
  - [x] 비밀번호 변경
  - [x] 전화번호 설정
  - [x] 정산계좌 설정 (은행명, 계좌번호, 예금주)

---

## 🚧 진행 예정 기능

### 높은 우선순위
- [ ] 관리자 - 예약 불가일 관리 화면
- [ ] SMS 발송 연동
  - 예약 접수 확인 알림
  - 예약일 리마인더

### 중간 우선순위
- [ ] 관리자 카테고리 관리 (가이드 분류)
- [ ] 파트너 통계/리포트
- [ ] 정산 상세 관리

### 낮은 우선순위
- [ ] 이메일 알림
- [ ] 푸시 알림

---

## 🔧 API 엔드포인트

### 문의 관련
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/inquiries` | 파트너 문의 목록 |
| PATCH | `/api/inquiries/[id]` | 문의 상태 변경 |
| GET | `/api/admin/inquiries` | 관리자 문의 목록 |
| PUT | `/api/admin/inquiries/[id]` | 관리자 문의 수정 |
| DELETE | `/api/admin/inquiries/[id]` | 관리자 문의 삭제 |
| POST | `/landing/api/inquiry` | 문의 등록 |

### 예약 관련
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/reservation/blocked-dates` | 예약 불가일 조회 |
| POST | `/api/reservation/blocked-dates` | 예약 불가일 등록 |
| DELETE | `/api/reservation/blocked-dates` | 예약 불가일 삭제 |
| POST | `/api/reservation/upload` | 서류 업로드 |

### 인증 관련
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/login` | 파트너 로그인 |
| POST | `/api/auth/register` | 파트너 가입 |
| GET | `/api/auth/me` | 내 정보 |
| PUT | `/api/auth/me` | 내 정보 수정 |
| POST | `/api/admin/auth/login` | 관리자 로그인 |

### 파트너 관련
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/partners` | 관리자 - 파트너 목록 |
| POST | `/api/admin/partners` | 관리자 - 파트너 생성 |
| DELETE | `/api/admin/partners/[id]` | 관리자 - 파트너 삭제 |
| GET | `/api/partners/subordinates` | 하위 파트너 목록 |

### 가이드 관련
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/guides` | 가이드 목록 |
| GET | `/api/guides/[id]` | 가이드 상세 |
| GET | `/api/admin/guides` | 관리자 - 가이드 목록 |
| POST | `/api/admin/guides` | 관리자 - 가이드 생성 |
| PUT | `/api/admin/guides/[id]` | 관리자 - 가이드 수정 |
| DELETE | `/api/admin/guides/[id]` | 관리자 - 가이드 삭제 |

---

## 📝 주요 비즈니스 로직

### MLM 파트너 구조
- **S코드 (level 0)**: 최상위 관리자급 파트너
- **레벨 1~N**: 일반 파트너 (referrer_code로 상위 파트너 연결)
- 상위 파트너는 하위 파트너의 문의 현황 조회 가능
- 하위 파트너 조회는 BFS 알고리즘으로 전체 하위 트리 탐색

### 문의 유형
- **상담 (consultation)**: 전화 상담 요청, 설치 수량만 입력
- **설치예약 (installation)**: 직접 예약, 날짜/시간/주소/서류 필요

### 서류 종류
- `idCard`: 신분증
- `paymentCard`: 결제수단
- `businessLicense`: 사업자등록증 (선택)

### 파트너 권한
- 본인 문의: 상태 변경 가능
- 하위 파트너 문의: 조회만 가능
- 서류 내용: 열람 불가 (유형만 표시)

### 관리자 권한
- 모든 문의 조회/수정/삭제
- 서류 미리보기/다운로드
- 파트너 관리 (생성/삭제, 민감정보 조회)
- 가이드/정산 관리

---

## 🎨 디자인 시스템

Tailwind CSS 커스텀 테마 적용 (`tailwind.config.ts`)

### 주요 색상
- `action-primary`: 메인 액션 색상 (버튼, 링크)
- `bg-primary`: 배경 기본
- `bg-card`: 카드 배경
- `text-primary/secondary/tertiary`: 텍스트 계층
- `status-new/progress/done/cancelled`: 상태 색상

### 컴포넌트
- `rounded-card`: 카드 모서리
- `rounded-button`: 버튼 모서리
- 반응형: `lg:` 기준 데스크탑/모바일 분리

### 다크 모드
- CSS 변수 기반 테마 시스템
- `.dark` 클래스로 다크 모드 전환

---

## 🔐 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
ADMIN_JWT_SECRET=
```

---

## 📌 참고사항

1. **Supabase Storage 버킷**: `inquiry-documents` (서류 저장)
2. **Signed URL 유효기간**: 7일
3. **파일 업로드 제한**: 10MB, JPG/PNG/WebP/PDF만 허용
4. **예약 가능 시간대**: 오전(morning), 오후(afternoon)
5. **캐싱 주의**: Vercel 배포 시 API 응답 캐싱 방지를 위해 `force-dynamic` 및 `Cache-Control` 헤더 필요

---

## 🔄 최근 업데이트 (2025-12-04)

### 추가된 기능
- 관리자 파트너 관리에 전화번호, 정산계좌 정보 표시
- 파트너 마이페이지에 전화번호, 정산계좌 설정 기능
- TipTap 에디터 이미지 드래그 앤 드롭/클립보드 업로드
- TipTap 에디터 이미지 링크 삽입 기능 (버블 메뉴)
- 하위 파트너 목록 조회 API 캐싱 문제 해결
- **Google 슬라이드 임베드 기능**
  - 가이드에 Google 슬라이드 삽입 가능
  - pub URL을 embed URL로 자동 변환
  - 16:9 비율 반응형 레이아웃
- **슬라이드 전체화면 보기**
  - 오른쪽 하단 전체화면 버튼
  - ESC 키 또는 바깥 영역 클릭으로 닫기
  - 모바일 최적화

### 수정된 버그
- 파트너 가입 시 referrer_code 컬럼 누락 문제
- 파트너 삭제 시 UUID vs Integer 타입 불일치 문제
- 하위 파트너 표시 안 되는 문제 (Vercel 캐싱)
- 슬라이드 전체화면 닫은 후 버튼 재표시 문제
