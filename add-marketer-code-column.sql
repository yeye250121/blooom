-- inquiries 테이블에 marketer_code 컬럼 추가

ALTER TABLE inquiries
ADD COLUMN marketer_code TEXT;

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX idx_inquiries_marketer_code ON inquiries(marketer_code);

-- 기존 데이터에 대한 처리 (선택사항)
-- 기존 문의는 marketer_code가 NULL로 유지됨
