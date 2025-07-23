# 🚀 Render 배포 가이드

Render에서 SoccerSquad 백엔드를 배포하는 완전한 가이드입니다.

## 📋 Render 배포 장점

- ✅ **무료 티어** 제공 (매월 750시간)
- ✅ **자동 SSL** 인증서
- ✅ **GitHub 자동 배포** 연동
- ✅ **쉬운 환경변수** 설정
- ✅ **무료 PostgreSQL** 데이터베이스 (500MB)

## 🔧 1단계: Render 서비스 생성

### Render 계정 생성 및 연결
1. [Render.com](https://render.com) 접속
2. **GitHub 계정으로 로그인**
3. **New** → **Web Service** 클릭
4. **fc-bro-manager** 저장소 선택

### 서비스 기본 설정
| 설정 항목 | 값 |
|----------|-----|
| **Name** | `soccersquad-backend` |
| **Region** | `Oregon (US West)` 또는 `Singapore` |
| **Branch** | `main` |
| **Root Directory** | `backend` ⭐ **중요** |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start:prod` |
| **Instance Type** | `Free` |

## ⚙️ 2단계: 환경변수 설정

Render 대시보드 **Environment** 탭에서 다음 환경변수들을 추가하세요:

### 🔗 Supabase 설정
```
SUPABASE_URL=https://nughewbiuwnoaagwkcpg.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2hld2JpdXdub2FhZ3drY3BnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzNjIyNiwiZXhwIjoyMDY4ODEyMjI2fQ.Ys5JKlGgnxXUaDsMNgZMMB31U
```

### 🔑 Kakao OAuth 설정
```
KAKAO_CLIENT_ID=f3faa68dd073b9ffdd2cfc7bfabdf07f
KAKAO_CLIENT_SECRET=KWccHkGvlbPtKEug6pNRvPia5D96stLE
KAKAO_CALLBACK_URL=https://soccersquad-backend.onrender.com/auth/kakao/callback
```

### 🔐 JWT 및 서버 설정
```
JWT_SECRET=soccer-squad-production-jwt-2025-render-secure
NODE_ENV=production
FRONTEND_URL=https://배포될프론트엔드도메인.vercel.app
```

## 🌐 3단계: 배포 및 도메인 확인

### 배포 과정
1. **Create Web Service** 클릭
2. **Deploy 로그** 확인 (약 3-5분 소요)
3. **성공 시 도메인** 확인: `https://soccersquad-backend.onrender.com`

### 도메인 업데이트
배포 완료 후 실제 도메인으로 환경변수 수정:
```
KAKAO_CALLBACK_URL=https://실제도메인.onrender.com/auth/kakao/callback
```

## 🔗 4단계: 카카오 개발자 콘솔 설정

[카카오 개발자 콘솔](https://developers.kakao.com)에서:

1. **SoccerSquad 앱** → **카카오 로그인** → **Redirect URI**
2. 다음 URI 추가:
   ```
   https://실제도메인.onrender.com/auth/kakao/callback
   ```

## 📱 5단계: 프론트엔드 연동

`frontend/.env.local` 파일 수정:
```bash
# 기존
VITE_API_BASE_URL=http://localhost:3001

# 변경
VITE_API_BASE_URL=https://실제도메인.onrender.com
```

## 🧪 6단계: 배포 테스트

### API 상태 확인
브라우저에서 접속:
```
https://실제도메인.onrender.com/
```

### 카카오 로그인 테스트
```
https://실제도메인.onrender.com/auth/kakao
```

### API 문서 (개발용)
로컬에서만 접근 가능:
```
http://localhost:3001/api-docs
```

## 🔄 7단계: 자동 재배포 설정

### GitHub 연동 자동 배포
- ✅ **main 브랜치**에 push 시 자동 재배포
- ✅ **Deploy 로그** 실시간 모니터링
- ✅ **Rollback** 기능 제공

### 수동 재배포
- Render 대시보드 **Manual Deploy** 버튼 사용

## 💡 문제 해결

### 자주 발생하는 오류

#### 1. Build 실패
```bash
# 해결방법
Root Directory: backend (정확히 설정)
Build Command: npm install && npm run build
```

#### 2. Start 실패
```bash
# 해결방법  
Start Command: npm run start:prod
NODE_ENV: production (환경변수 확인)
```

#### 3. CORS 오류
```bash
# 해결방법
FRONTEND_URL 환경변수를 정확한 프론트엔드 도메인으로 설정
```

#### 4. Kakao OAuth 오류
```bash
# 해결방법
1. KAKAO_CALLBACK_URL 정확히 설정
2. 카카오 콘솔에서 Redirect URI 추가
3. IP 제한 해제
```

### Render 로그 확인
- **Logs** 탭에서 실시간 로그 모니터링
- **Events** 탭에서 배포 히스토리 확인

## 📊 Render 무료 티어 제한사항

| 항목 | 제한 |
|------|------|
| **실행 시간** | 월 750시간 |
| **Sleep 모드** | 15분 비활성 시 자동 Sleep |
| **Cold Start** | Sleep 후 첫 요청 시 30초 지연 |
| **대역폭** | 월 100GB |
| **빌드 시간** | 무제한 |

## 🎯 최종 체크리스트

- [ ] Render 서비스 생성 완료
- [ ] Root Directory `backend` 설정
- [ ] Build/Start Command 정확히 설정
- [ ] 모든 환경변수 입력 완료
- [ ] 배포 성공 및 도메인 확인
- [ ] KAKAO_CALLBACK_URL 실제 도메인으로 수정
- [ ] 카카오 개발자 콘솔 Redirect URI 추가
- [ ] 프론트엔드 API 주소 변경
- [ ] 카카오 로그인 테스트 완료
- [ ] GitHub 자동 배포 연동 확인

## 🚀 배포 완료!

모든 설정이 완료되면:
- **백엔드**: `https://실제도메인.onrender.com`
- **API 상태**: 브라우저에서 접속 시 응답 확인
- **자동 배포**: GitHub push 시 자동 재배포

**Render는 무료 티어에서도 안정적이고 사용하기 쉽습니다! 🎉** 