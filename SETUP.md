# 🛠️ SoccerSquad 개발 환경 설정 가이드

## 📋 시스템 요구사항

- **Node.js**: 18.0.0 이상
- **npm**: 9.0.0 이상 (또는 yarn 3.0.0 이상)
- **Git**: 최신 버전

## 🔧 단계별 설정

### 1. 프로젝트 설정

```bash
# 프로젝트 클론
git clone <repository-url>
cd fc-bro-manager

# 권한 확인 (Linux/Mac)
ls -la
```

### 2. Backend 설정 (NestJS)

```bash
cd backend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# .env 파일 편집 (예시)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
PORT=3001
NODE_ENV=development
```

### 3. Frontend 설정 (React + Vite)

```bash
cd ../frontend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local

# .env.local 파일 편집 (예시)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_KAKAO_CLIENT_ID=your-kakao-client-id
VITE_API_BASE_URL=http://localhost:3001
```

### 4. 개발 서버 실행

```bash
# 방법 1: 각각 별도 터미널에서 실행
# Terminal 1
cd backend && npm run start:dev

# Terminal 2  
cd frontend && npm run dev

# 방법 2: 동시 실행 (선택사항)
npm install -g concurrently
concurrently "cd backend && npm run start:dev" "cd frontend && npm run dev"
```

### 5. 접속 확인

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API 문서 (Swagger)**: http://localhost:3001/api-docs

## 🔍 추가 설정

### shadcn/ui 컴포넌트 추가 (프론트엔드)

```bash
cd frontend

# shadcn/ui 설치 및 설정 (이미 설정됨)
npx shadcn-ui@latest init

# 개별 컴포넌트 추가 예시
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
```

### Supabase 설정

1. [Supabase 웹사이트](https://supabase.com)에서 새 프로젝트 생성
2. 데이터베이스 설정:
   ```sql
   -- 사용자 테이블
   CREATE TABLE users (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     position_main TEXT NOT NULL,
     position_sub TEXT[],
     level INTEGER DEFAULT 3,
     is_admin BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- 경기 테이블  
   CREATE TABLE matches (
     id SERIAL PRIMARY KEY,
     date DATE NOT NULL,
     time TIME NOT NULL,
     location TEXT NOT NULL,
     created_by TEXT REFERENCES users(id),
     status TEXT DEFAULT 'open',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- 출석 테이블
   CREATE TABLE attendance (
     match_id INTEGER REFERENCES matches(id),
     user_id TEXT REFERENCES users(id),
     status TEXT CHECK (status IN ('attending', 'not_attending', 'undecided')),
     updated_at TIMESTAMP DEFAULT NOW(),
     PRIMARY KEY (match_id, user_id)
   );

   -- 팀 편성 테이블
   CREATE TABLE team_assignments (
     id SERIAL PRIMARY KEY,
     match_id INTEGER REFERENCES matches(id),
     yellow_team TEXT[],
     blue_team TEXT[],
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

### 카카오 개발자 설정

1. [카카오 개발자](https://developers.kakao.com)에서 앱 생성
2. **플랫폼 설정**:
   - 웹: http://localhost:3000
   - Redirect URI: http://localhost:3000/auth/callback
3. **동의항목 설정**:
   - 닉네임: 필수
   - 프로필 사진: 선택

## ⚠️ 문제 해결

### 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인 (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# 포트 사용 중인 프로세스 확인 (Mac/Linux)
lsof -i :3000
lsof -i :3001
```

### 의존성 충돌
```bash
# 캐시 정리 및 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### TypeScript 오류
```bash
# TypeScript 컴파일 확인
npm run build
```

## 🚀 배포 준비

### Frontend (Vercel)
1. GitHub 저장소와 연결
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. 환경 변수 설정

### Backend (Supabase Edge Functions)
1. Supabase CLI 설치
2. 프로젝트 초기화
3. Edge Functions 배포

자세한 배포 가이드는 별도 문서에서 제공될 예정입니다. 