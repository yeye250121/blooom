-- 데모 사용자 생성
-- 로그인 ID: demo
-- 비밀번호: demo123

-- bcrypt hash for 'demo123' (10 rounds)
INSERT INTO users (login_id, password_hash, nickname, unique_code, level)
VALUES (
  'demo',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '데모 관리자',
  'S00001',
  1
)
ON CONFLICT (login_id) DO NOTHING;
