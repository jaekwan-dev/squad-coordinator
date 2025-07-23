# 🚀 Vercel 프론트엔드 배포 가이드

Vercel에서 SoccerSquad React 프론트엔드를 배포하는 완전한 가이드입니다.

## 📋 Vercel 배포 장점

- ✅ **무료 배포** (개인 프로젝트)
- ✅ **자동 SSL** HTTPS 인증서
- ✅ **GitHub 자동 배포** push 시 즉시 배포
- ✅ **글로벌 CDN** 빠른 로딩 속도
- ✅ **도메인 설정** 간편한 커스텀 도메인

## 🔧 1단계: 로컬 환경변수 설정

먼저 로컬 개발을 위해 `frontend/.env.local` 파일을 만드세요:

```bash
# Supabase 설정
VITE_SUPABASE_URL=https://nughewbiuwnoaagwkcpg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2hld2JpdXdub2FhZ3drY3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzYyMjYsImV4cCI6MjA2ODgxMjIyNn0.QcBEU7brXnSDp5OcmjoHb48wDVBvJQN7AEQgmbm5mII

# Kakao OAuth 설정 (JavaScript 키)
VITE_KAKAO_CLIENT_ID=3fc23201ea2d2318c1c8d6ecee1a2ef0

# 로컬 개발용 백엔드 API
VITE_API_BASE_URL=http://localhost:3001
```

## 🌐 2단계: Vercel 프로젝트 생성

### Vercel 계정 및 프로젝트 생성
1. [Vercel.com](https://vercel.com) 접속
2. **GitHub 계정으로 로그인**
3. **Add New...** → **Project** 클릭
4. **fc-bro-manager** 저장소 선택

### 프로젝트 설정
| 설정 항목 | 값 |
|----------|-----|
| **Framework Preset** | `Vite` (자동 감지) |
| **Root Directory** | `frontend` ⭐ **중요** |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

## ⚙️ 3단계: Vercel 환경변수 설정

Vercel 대시보드 **Settings** → **Environment Variables** 탭에서 다음 환경변수들을 추가:

### 🔗 Supabase 설정
| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://nughewbiuwnoaagwkcpg.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (긴 토큰) |

### 🔑 Kakao OAuth 설정
| Name | Value |
|------|-------|
| `VITE_KAKAO_CLIENT_ID` | `3fc23201ea2d2318c1c8d6ecee1a2ef0` |

### 🌐 백엔드 API 설정 ⭐ **가장 중요**
| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://squad-coordinator.onrender.com` |

> ⚠️ **중요**: `VITE_API_BASE_URL`은 Render에서 백엔드 배포 완료 후 실제 도메인으로 설정하세요!

## 🔄 4단계: 배포 순서 (중요!)

### 올바른 배포 순서:
1. **1️⃣ 백엔드 배포** (Render) → 도메인 확인
2. **2️⃣ 프론트엔드 환경변수** 설정 (`VITE_API_BASE_URL`)
3. **3️⃣ 프론트엔드 배포** (Vercel)
4. **4️⃣ 카카오 콘솔** 설정 업데이트

### 현재 배포 상태 확인:
- **백엔드**: `https://squad-coordinator.onrender.com` ✅
- **프론트엔드**: 배포 예정 → `https://squad-coordinator.vercel.app`

## 🌍 5단계: 도메인 연결

### 배포 완료 후:
1. **Vercel 도메인 확인**: `https://squad-coordinator.vercel.app`
2. **백엔드 환경변수 업데이트**:
   ```bash
   FRONTEND_URL=https://squad-coordinator.vercel.app
   ```

## 🔗 6단계: 카카오 개발자 콘솔 설정

[카카오 개발자 콘솔](https://developers.kakao.com)에서:

### 플랫폼 설정
1. **앱 설정** → **플랫폼** → **웹 플랫폼 추가**
2. **사이트 도메인** 추가:
   ```
   https://squad-coordinator.vercel.app
   ```

### JavaScript 키 도메인 설정
1. **앱 설정** → **앱 키** → **JavaScript 키** → **플랫폼 설정**
2. **웹 도메인** 추가:
   ```
   https://squad-coordinator.vercel.app
   ```

## 🧪 7단계: 배포 테스트

### 프론트엔드 접속 테스트
```
https://squad-coordinator.vercel.app
```

### 백엔드 API 연결 테스트
개발자 도구 → Network 탭에서 API 호출 확인:
```
https://squad-coordinator.onrender.com/auth/profile
```

### 카카오 로그인 테스트
1. **카카오 로그인** 버튼 클릭
2. **카카오 인증** 완료
3. **자동 리다이렉트** 확인
4. **프로필 표시** 확인

## 🔄 8단계: 자동 재배포 설정

### GitHub 연동 자동 배포
- ✅ **main 브랜치** push 시 자동 재배포
- ✅ **Preview 배포** Pull Request 시
- ✅ **Production 배포** main 브랜치 머지 시

### 수동 재배포
- Vercel 대시보드 **Deployments** → **Redeploy** 버튼

## 💡 문제 해결

### 자주 발생하는 오류

#### 1. 환경변수 인식 안됨
```bash
# 해결방법
1. Vercel 환경변수명에 VITE_ 접두사 확인
2. 배포 후 환경변수 변경 시 Redeploy 필요
3. 로컬과 프로덕션 환경변수 값 다름 확인
```

#### 2. API 호출 실패 (CORS)
```bash
# 해결방법
1. VITE_API_BASE_URL이 정확한 Render 도메인인지 확인
2. 백엔드 CORS 설정에 Vercel 도메인 포함되었는지 확인
3. HTTPS vs HTTP 프로토콜 확인
```

#### 3. 카카오 로그인 실패
```bash
# 해결방법
1. 카카오 콘솔에 Vercel 도메인 추가했는지 확인
2. JavaScript 키가 올바른지 확인
3. 플랫폼 설정에 도메인 등록했는지 확인
```

#### 4. 빌드 실패
```bash
# 해결방법
1. Root Directory가 frontend로 설정되었는지 확인
2. package.json의 build 스크립트 확인
3. 환경변수 오타 확인
```

## 📊 Vercel 무료 티어 제한사항

| 항목 | 제한 |
|------|------|
| **대역폭** | 월 100GB |
| **빌드 시간** | 월 6,000분 |
| **Function 실행** | 월 100GB-hr |
| **팀 멤버** | 1명 (개인 계정) |
| **도메인** | 무제한 |

## 🎯 최종 체크리스트

### 백엔드 (Render) 준비사항
- [ ] Render 배포 완료
- [ ] 도메인 확인: `https://squad-coordinator.onrender.com`
- [ ] API 상태 정상 확인

### 프론트엔드 (Vercel) 배포
- [ ] Vercel 프로젝트 생성 완료
- [ ] Root Directory `frontend` 설정
- [ ] 모든 환경변수 입력 완료
- [ ] `VITE_API_BASE_URL` 올바른 Render 도메인으로 설정
- [ ] 배포 성공 및 도메인 확인

### 연동 설정
- [ ] 백엔드 `FRONTEND_URL` Vercel 도메인으로 수정
- [ ] 카카오 콘솔 플랫폼에 Vercel 도메인 추가
- [ ] 카카오 JavaScript 키 도메인 설정

### 최종 테스트
- [ ] 프론트엔드 접속 성공
- [ ] 카카오 로그인 정상 작동
- [ ] 프로필 표시 확인
- [ ] GitHub 자동 배포 확인

## 🚀 배포 완료!

모든 설정이 완료되면:
- **프론트엔드**: `https://squad-coordinator.vercel.app`
- **백엔드**: `https://squad-coordinator.onrender.com`
- **자동 배포**: GitHub push 시 자동 재배포

**이제 완전한 프로덕션 환경에서 SoccerSquad를 사용할 수 있습니다! 🎉**

---

## 📝 환경변수 요약

### 로컬 개발용 (.env.local)
```bash
VITE_SUPABASE_URL=https://nughewbiuwnoaagwkcpg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_KAKAO_CLIENT_ID=3fc23201ea2d2318c1c8d6ecee1a2ef0
VITE_API_BASE_URL=http://localhost:3001
```

### Vercel 프로덕션용 환경변수
```bash
VITE_SUPABASE_URL=https://nughewbiuwnoaagwkcpg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_KAKAO_CLIENT_ID=3fc23201ea2d2318c1c8d6ecee1a2ef0
VITE_API_BASE_URL=https://squad-coordinator.onrender.com
``` 