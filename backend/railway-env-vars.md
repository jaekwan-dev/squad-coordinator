# 🚀 Railway 배포용 환경변수 설정 가이드

Railway 대시보드의 **Variables** 탭에서 아래 환경변수들을 정확히 입력하세요.

## 📋 필수 환경변수 목록

### 🔗 Supabase 설정
```bash
SUPABASE_URL=https://nughewbiuwnoaagwkcpg.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2hld2JpdXdub2FhZ3drY3BnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzNjIyNiwiZXhwIjoyMDY4ODEyMjI2fQ.Ys5JKlGgnxXUaDsMNgZMMB31U
```

### 🔑 Kakao OAuth 설정
```bash
KAKAO_CLIENT_ID=f3faa68dd073b9ffdd2cfc7bfabdf07f
KAKAO_CLIENT_SECRET=KWccHkGvlbPtKEug6pNRvPia5D96stLE
KAKAO_CALLBACK_URL=https://YOUR-APP-NAME.railway.app/auth/kakao/callback
```

### 🔐 JWT 설정
```bash
JWT_SECRET=soccer-squad-production-jwt-2025-ultra-secure-key-change-this
```

### 🌐 서버 설정
```bash
NODE_ENV=production
FRONTEND_URL=https://YOUR-FRONTEND-APP.vercel.app
```

## 🔧 Railway 배포 단계별 가이드

### 1단계: Railway 프로젝트 생성
1. [Railway.app](https://railway.app) 접속 → GitHub 로그인
2. **New Project** → **Deploy from GitHub repo**
3. **fc-bro-manager** 저장소 선택

### 2단계: 서비스 설정
1. **Settings** 탭에서:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build` 
   - **Start Command**: `npm run start:prod`

### 3단계: 환경변수 설정
**Variables** 탭에서 위의 모든 환경변수를 하나씩 추가:

| 변수명 | 값 |
|--------|-----|
| `SUPABASE_URL` | `https://nughewbiuwnoaagwkcpg.supabase.co` |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOi...` (긴 토큰) |
| `KAKAO_CLIENT_ID` | `f3faa68dd073b9ffdd2cfc7bfabdf07f` |
| `KAKAO_CLIENT_SECRET` | `KWccHkGvlbPtKEug6pNRvPia5D96stLE` |
| `KAKAO_CALLBACK_URL` | `https://배포된도메인.railway.app/auth/kakao/callback` |
| `JWT_SECRET` | `soccer-squad-production-jwt-2025-ultra-secure-key-change-this` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://배포될프론트엔드도메인.vercel.app` |

## ⚠️ 배포 후 필수 작업

### 4단계: 도메인 설정
1. **배포 완료 후** Railway에서 제공하는 도메인 확인
   - 예: `https://fc-bro-manager-production-a1b2c3.railway.app`

2. **KAKAO_CALLBACK_URL** 환경변수를 실제 도메인으로 수정
   - 기존: `https://YOUR-APP-NAME.railway.app/auth/kakao/callback`
   - 수정: `https://fc-bro-manager-production-a1b2c3.railway.app/auth/kakao/callback`

### 5단계: 카카오 개발자 콘솔 설정
[카카오 개발자 콘솔](https://developers.kakao.com)에서:
1. **SoccerSquad 앱** → **카카오 로그인** → **Redirect URI**
2. 다음 URI 추가:
   ```
   https://fc-bro-manager-production-a1b2c3.railway.app/auth/kakao/callback
   ```

### 6단계: 프론트엔드 연동 
`frontend/.env.local` 파일에서 API 주소 변경:
```bash
VITE_API_BASE_URL=https://fc-bro-manager-production-a1b2c3.railway.app
```

## 🧪 배포 테스트

### API 상태 확인:
```bash
curl https://배포된도메인.railway.app/
```

### 카카오 로그인 테스트:
```bash
https://배포된도메인.railway.app/auth/kakao
```

## 💡 문제 해결

### 자주 발생하는 오류:
1. **500 Error**: 환경변수 누락 → Variables 탭에서 모든 변수 확인
2. **CORS Error**: FRONTEND_URL 미설정 → 프론트엔드 도메인 정확히 입력
3. **Kakao OAuth Error**: Redirect URI 불일치 → 카카오 콘솔에서 URI 추가

### Railway 로그 확인:
- Deploy 탭에서 실시간 로그 모니터링
- 오류 발생 시 Stack Trace 확인

---

## 🎯 최종 체크리스트

- [ ] Railway 프로젝트 생성 완료
- [ ] Root Directory를 `backend`로 설정
- [ ] 모든 환경변수 Variables 탭에 입력 완료
- [ ] 배포 성공 및 도메인 확인
- [ ] KAKAO_CALLBACK_URL을 실제 도메인으로 수정
- [ ] 카카오 개발자 콘솔에 Redirect URI 추가
- [ ] 프론트엔드 API 주소 변경
- [ ] 카카오 로그인 테스트 완료

**모든 단계 완료 후 프로덕션 배포 성공! 🎉** 