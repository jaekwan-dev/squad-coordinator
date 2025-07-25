-- 경기 테이블 생성
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  match_date DATE NOT NULL,
  match_time TIME NOT NULL,
  location VARCHAR(500) NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 참석 테이블 생성
CREATE TABLE IF NOT EXISTS attendances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('attending', 'not_attending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(match_id, user_id) -- 한 사용자는 한 경기에 한 번만 투표 가능
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_creator ON matches(creator_id);
CREATE INDEX IF NOT EXISTS idx_matches_active ON matches(is_active);
CREATE INDEX IF NOT EXISTS idx_attendances_match ON attendances(match_id);
CREATE INDEX IF NOT EXISTS idx_attendances_user ON attendances(user_id);
CREATE INDEX IF NOT EXISTS idx_attendances_status ON attendances(status);

-- RLS (Row Level Security) 비활성화 (개발 단계)
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendances DISABLE ROW LEVEL SECURITY;

-- 업데이트 트리거 생성 (updated_at 자동 갱신)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendances_updated_at BEFORE UPDATE ON attendances 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입 (테스트용)
-- 관리자 사용자의 ID를 가져와서 샘플 경기 생성
-- INSERT INTO matches (title, match_date, match_time, location, description, creator_id) 
-- SELECT 
--   '토요일 정기전', 
--   CURRENT_DATE + INTERVAL '7 days', 
--   '14:00:00', 
--   '서울월드컵경기장 보조구장', 
--   '주말 정기 경기입니다. 많은 참여 부탁드립니다!',
--   id 
-- FROM users 
-- WHERE is_admin = true 
-- LIMIT 1; 