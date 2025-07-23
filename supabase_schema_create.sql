-- ⚽ SoccerSquad 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 테이블 삭제 (있는 경우)
DROP TABLE IF EXISTS team_assignments CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. 사용자 테이블 생성
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position_main TEXT NOT NULL CHECK (position_main IN ('GK', 'DF', 'MF', 'FW')),
  position_sub TEXT[] DEFAULT '{}',
  level INTEGER DEFAULT 3 CHECK (level >= 1 AND level <= 5),
  is_admin BOOLEAN DEFAULT FALSE,
  profile_image TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 경기 테이블  
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  created_by TEXT REFERENCES users(id),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 출석 테이블
CREATE TABLE attendance (
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('attending', 'not_attending', 'undecided')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (match_id, user_id)
);

-- 5. 팀 편성 테이블
CREATE TABLE team_assignments (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  yellow_team TEXT[] DEFAULT '{}',
  blue_team TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. 트리거 생성
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. RLS (Row Level Security) 정책 설정 (비활성화)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_assignments DISABLE ROW LEVEL SECURITY;

-- 9. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date);
CREATE INDEX IF NOT EXISTS idx_attendance_match_id ON attendance(match_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);

-- 10. 테스트 데이터 삽입 (선택사항)
INSERT INTO users (id, name, position_main, position_sub, level, is_admin, profile_image) 
VALUES ('test_user_1', '테스트 사용자', 'MF', '{"FW"}', 3, true, '')
ON CONFLICT (id) DO NOTHING;

-- 완료 확인
SELECT 
  'SoccerSquad 데이터베이스 스키마 생성 완료!' as message,
  COUNT(*) as user_count
FROM users; 