# 🔧 Render 환경변수 설정 체크리스트

## 🚨 "supabaseUrl is required" 에러 해결

### 📋 1단계: Render 대시보드에서 환경변수 확인

1. **[Render 대시보드](https://dashboard.render.com)** 접속
2. **squad-coordinator** 서비스 선택
3. **Environment** 탭 클릭
4. 다음 환경변수들이 **모두 설정되어 있는지** 확인:

### ✅ 필수 환경변수 체크리스트

| 환경변수명 | 값 | 상태 |
|------------|-----|------|
| `SUPABASE_URL` | `https://nughewbiuwnoaagwkcpg.supabase.co` | [ ] |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | [ ] |
| `KAKAO_CLIENT_ID` | `f3faa68dd073b9ffdd2cfc7bfabdf07f` | [ ] |
| `KAKAO_CLIENT_SECRET` | `KWccHkGvlbPtKEug6pNRvPia5D96stLE` | [ ] |
| `KAKAO_CALLBACK_URL` | `https://squad-coordinator.onrender.com/auth/kakao/callback` | [ ] |
| `JWT_SECRET` | `soccer-squad-production-jwt-2025-render-secure` | [ ] |
| `NODE_ENV` | `production` | [ ] |
| `FRONTEND_URL` | `https://squad-coordinator.vercel.app` | [ ] |

### 🔧 2단계: 누락된 환경변수 추가

만약 위 환경변수들이 누락되었다면:

1. **Environment** 탭에서 **Add Environment Variable** 클릭
2. **Key**와 **Value**를 정확히 입력
3. **Save Changes** 클릭

### 📝 환경변수 복사용 (정확한 값들)

```bash
# 🔗 Supabase 설정
SUPABASE_URL=https://nughewbiuwnoaagwkcpg.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2hld2JpdXdub2FhZ3drY3BnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzNjIyNiwiZXhwIjoyMDY4ODEyMjI2fQ.Ys5JKlGgnxXUaDsMNgZMMB31U

# 🔑 Kakao OAuth 설정
KAKAO_CLIENT_ID=f3faa68dd073b9ffdd2cfc7bfabdf07f
KAKAO_CLIENT_SECRET=KWccHkGvlbPtKEug6pNRvPia5D96stLE
KAKAO_CALLBACK_URL=https://squad-coordinator.onrender.com/auth/kakao/callback

# 🔐 JWT 및 서버 설정
JWT_SECRET=soccer-squad-production-jwt-2025-render-secure
NODE_ENV=production
FRONTEND_URL=https://squad-coordinator.vercel.app
```

### ⚠️ 3단계: 환경변수 추가 후 재배포

환경변수를 추가한 후:

1. **Manual Deploy** 버튼 클릭
2. 또는 GitHub에 더미 커밋 후 push:
   ```bash
   git commit --allow-empty -m "Trigger redeploy after env vars"
   git push origin main
   ```

### 🔍 4단계: 배포 로그 확인

배포 시작 후 **Logs** 탭에서 다음 로그 확인:

#### ✅ 성공적인 로그 예시:
```
🔍 Environment Variables Check:
NODE_ENV: production
SUPABASE_URL: Set ✅
SUPABASE_SERVICE_KEY: Set ✅
✅ Supabase client initialized successfully
🚀 SoccerSquad Backend is running on: https://squad-coordinator.onrender.com
```

#### ❌ 실패 로그 예시:
```
🔍 Environment Variables Check:
NODE_ENV: production
SUPABASE_URL: Missing ❌
SUPABASE_SERVICE_KEY: Missing ❌
❌ SUPABASE_URL environment variable is required. Current value: undefined
```

### 💡 5단계: 문제 해결

#### 문제 1: 환경변수가 설정되어 있는데도 Missing으로 나타남
- **해결**: Render 서비스 재시작
- **방법**: Settings → Restart Service

#### 문제 2: 환경변수 값에 오타가 있음
- **해결**: Environment 탭에서 값을 다시 확인하고 수정
- **주의**: 공백이나 따옴표 없이 정확히 입력

#### 문제 3: 캐시 문제
- **해결**: Clear Build Cache 후 재배포
- **방법**: Settings → Clear Build Cache → Manual Deploy

### 🧪 6단계: API 테스트

배포 성공 후 브라우저에서 테스트:

#### 기본 API 응답 확인:
```
https://squad-coordinator.onrender.com/
```

#### Swagger API 문서 (개발 시에만 접근 가능):
```
로컬에서만: http://localhost:3001/api-docs
```

#### 카카오 로그인 테스트:
```
https://squad-coordinator.onrender.com/auth/kakao
```

### 🎯 성공 확인 체크리스트

- [ ] 모든 환경변수가 Render에 설정됨
- [ ] 배포 로그에서 "✅ Supabase client initialized successfully" 확인
- [ ] `https://squad-coordinator.onrender.com/` 접속 성공
- [ ] 환경변수 디버깅 로그가 모든 항목에 "Set ✅" 표시

### 🚀 다음 단계

백엔드 배포 성공 후:
1. **프론트엔드 Vercel 배포**
2. **카카오 개발자 콘솔 설정**
3. **통합 테스트**

---

**💡 팁**: 환경변수 설정 후 반드시 Manual Deploy를 클릭하여 새로운 설정으로 재배포하세요! 