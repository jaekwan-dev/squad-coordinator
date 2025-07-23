# ⚽ SoccerSquad

축구 동호회를 위한 팀원 관리, 경기 일정, 출석 투표, 자동 팀 편성 웹앱

## 🏗️ 프로젝트 구조

```
fc-bro-manager/
├── backend/          # NestJS 백엔드 서버
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/         # React 프론트엔드
│   ├── src/
│   ├── package.json
│   └── ...
├── PRD.md           # 제품 요구사항 명세서
└── README.md        # 이 파일
```

## 🛠️ 기술 스택

### Frontend
- **React 18** + **TypeScript**
- **Vite** (빌드 도구)
- **TailwindCSS** (스타일링)
- **shadcn/ui** (UI 컴포넌트)
- **Vercel** (배포)

### Backend  
- **NestJS** + **TypeScript**
- **Supabase** (데이터베이스 & 배포)
- **카카오 OAuth API** (소셜 로그인)

## 🚀 개발 환경 설정

### Prerequisites
- Node.js 18+
- npm 또는 yarn
- Git

### 설치 및 실행

1. **프로젝트 클론 및 초기 설정**
```bash
git clone <repository-url>
cd fc-bro-manager
```

2. **환경 변수 설정**
```bash
# Backend 환경 변수 복사 및 설정
cd backend
cp .env.example .env
# .env 파일을 열어서 실제 값으로 수정

# Frontend 환경 변수 복사 및 설정  
cd ../frontend
cp .env.local.example .env.local
# .env.local 파일을 열어서 실제 값으로 수정
```

3. **의존성 설치**
```bash
# Frontend
cd frontend
npm install

# Backend  
cd ../backend
npm install
```

4. **개발 서버 실행**
```bash
# 터미널 1: Backend 서버 (port 3001)
cd backend
npm run start:dev

# 터미널 2: Frontend 서버 (port 3000)
cd frontend
npm run dev
```

5. **접속 확인**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API 문서: http://localhost:3001/api-docs

## 📋 주요 기능

- ✅ **카카오 소셜 로그인** - OAuth 인증 완료
- 🔄 팀원 등록 및 포지션 관리
- 🔄 경기 일정 생성 및 출석 투표
- 🔄 자동 팀 편성 (포지션 밸런스 고려)
- 🔄 관리자 권한 (총무 기능)

자세한 기능 명세는 [PRD.md](./PRD.md)를 참고하세요.

## 🎯 최근 업데이트

- ✅ **2025-01-22**: 카카오 OAuth 로그인 시스템 구현 완료
  - NestJS 백엔드 인증 모듈 구현
  - React 프론트엔드 인증 컨텍스트 구현
  - JWT 토큰 기반 사용자 세션 관리
  - Supabase 사용자 데이터베이스 연동

## 🔧 환경 변수

### Frontend (.env.local)
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_KAKAO_CLIENT_ID=your_kakao_javascript_key
VITE_API_BASE_URL=http://localhost:3001
```

### Backend (.env)  
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
KAKAO_CLIENT_ID=your_kakao_rest_api_key
KAKAO_CLIENT_SECRET=your_kakao_client_secret
KAKAO_CALLBACK_URL=http://localhost:3001/auth/kakao/callback
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

🔗 **카카오 개발자 설정**: [KAKAO_SETUP.md](./KAKAO_SETUP.md) 참고 