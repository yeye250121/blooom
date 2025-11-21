-- RLS 정책 업데이트 (Service Role Key 없이 작동)

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON inquiries;
DROP POLICY IF EXISTS "Authenticated users can view inquiries" ON inquiries;
DROP POLICY IF EXISTS "Authenticated users can view users" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- inquiries 테이블 RLS 비활성화 (anon key로 접근 가능)
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;

-- users 테이블 RLS 비활성화 (anon key로 접근 가능)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- partner_guides 테이블 RLS 비활성화 (개발 환경)
ALTER TABLE partner_guides DISABLE ROW LEVEL SECURITY;

-- 참고: 프로덕션 환경에서는 RLS를 활성화하고 적절한 정책을 설정하는 것이 좋습니다.
-- 지금은 개발 단계이므로 RLS를 비활성화합니다.
