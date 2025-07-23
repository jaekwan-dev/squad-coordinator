# 🚨 Vercel 404 에러 해결 가이드

## 📋 1단계: Vercel 대시보드 프로젝트 설정 확인

### 🔧 기본 설정 체크리스트

1. **[Vercel 대시보드](https://vercel.com/dashboard)** 접속
2. **squad-coordinator** 프로젝트 선택
3. **Settings** 탭 클릭
4. **General** 에서 다음 설정 확인:

| 설정 항목 | 올바른 값 | 현재 설정 |
|----------|-----------|-----------|
| **Framework Preset** | `Vite` | [ ] |
| **Root Directory** | `frontend` ⭐ **가장 중요** | [ ] |
| **Build Command** | `npm run build` | [ ] |
| **Output Directory** | `dist` | [ ] |
| **Install Command** | `npm install` | [ ] |
| **Node.js Version** | `18.x` | [ ] |

### ⚠️ Root Directory 설정이 가장 중요!

- **Root Directory**가 `frontend`로 설정되지 않으면 404 에러 발생
- 빈 값이거나 `.` 으로 되어 있으면 안됨

## 📝 2단계: 환경변수 설정 확인

**Settings** → **Environment Variables** 탭에서 다음 4개 변수 확인:

### ✅ 필수 환경변수 (모든 Environment: Production, Preview, Development)

| Variable Name | Value | Status |
|---------------|-------|--------|
| `VITE_SUPABASE_URL` | `https://nughewbiuwnoaagwkcpg.supabase.co` | [ ] |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | [ ] |
| `VITE_KAKAO_CLIENT_ID` | `3fc23201ea2d2318c1c8d6ecee1a2ef0` | [ ] |
| `VITE_API_BASE_URL` | `https://squad-coordinator.onrender.com` | [ ] |

### 환경변수 복사용 (정확한 값들):

```bash
VITE_SUPABASE_URL=https://nughewbiuwnoaagwkcpg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2hld2JpdXdub2FhZ3drY3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzYyMjYsImV4cCI6MjA2ODgxMjIyNn0.QcBEU7brXnSDp5OcmjoHb48wDVBvJQN7AEQgmbm5mII
VITE_KAKAO_CLIENT_ID=3fc23201ea2d2318c1c8d6ecee1a2ef0
VITE_API_BASE_URL=https://squad-coordinator.onrender.com
```

## 🔄 3단계: 재배포 트리거

설정 변경 후:

### 방법 1: Vercel 대시보드에서
1. **Deployments** 탭 → **Redeploy** 버튼 클릭
2. **Use existing Build Cache** 체크 해제
3. **Redeploy** 클릭

### 방법 2: GitHub Push
```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

## 🔍 4단계: 배포 로그 확인

**Deployments** 탭에서 최신 배포 선택 후 **View Function Logs** 확인:

### ✅ 성공적인 빌드 로그:
```
✓ Installing dependencies...
✓ Building...
✓ Generating static files...
✓ Uploading...
✓ Deployment completed
```

### ❌ 실패 로그 예시:
```
❌ Build failed
❌ No such file or directory: package.json
❌ Root directory not found
```

## 🧪 5단계: 배포 테스트

### 기본 접속 테스트:
```
https://squad-coordinator.vercel.app/
```

### 환경변수 확인 (개발자 도구):
```javascript
// 브라우저 콘솔에서 실행
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('All env vars:', import.meta.env);
```

## 💡 자주 발생하는 문제들

### 문제 1: "Root Directory 설정 안됨"
**증상**: 404 페이지 또는 빈 화면
**해결**: Settings → General → Root Directory를 `frontend`로 설정

### 문제 2: "환경변수 인식 안됨"
**증상**: API 호출 실패, 로그인 버튼 오류
**해결**: 
- 환경변수명에 `VITE_` 접두사 확인
- 모든 Environment (Production, Preview, Development)에 설정

### 문제 3: "빌드 실패"
**증상**: "Build failed" 에러
**해결**: 
- Build Command: `npm run build` 확인
- Output Directory: `dist` 확인
- Node.js 버전 18.x 설정

### 문제 4: "CORS 에러"
**증상**: 백엔드 API 호출 실패
**해결**: 
- `VITE_API_BASE_URL`이 정확한 Render 도메인인지 확인
- 백엔드 CORS 설정에 Vercel 도메인 추가

## 🔧 6단계: 고급 문제 해결

### vercel.json 설정 확인
파일 경로: `frontend/vercel.json`

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 캐시 문제 해결
1. **Deployments** → 최신 배포 → **Redeploy**
2. **Use existing Build Cache** 체크 해제
3. **Clear Cache and Deploy**

### 도메인 문제 해결
- Custom Domain 설정한 경우 DNS 설정 확인
- 기본 Vercel 도메인 (`*.vercel.app`)에서 먼저 테스트

## 🎯 성공 확인 체크리스트

- [ ] Root Directory가 `frontend`로 설정됨
- [ ] 4개 환경변수 모두 설정됨
- [ ] 빌드 성공 ("✓ Deployment completed")
- [ ] `https://squad-coordinator.vercel.app/` 접속 성공
- [ ] 개발자 도구에서 환경변수 확인됨
- [ ] 카카오 로그인 버튼 표시됨

## 🚀 최종 테스트

모든 설정 완료 후:

1. **기본 접속**: `https://squad-coordinator.vercel.app/`
2. **환경변수 테스트**: 개발자 도구 콘솔에서 확인
3. **카카오 로그인**: 버튼 클릭 테스트
4. **백엔드 연동**: 로그인 후 프로필 표시 확인

## 📞 추가 도움이 필요한 경우

1. **Vercel 배포 로그** 전체 내용 공유
2. **현재 도메인** 접속 시 나타나는 화면 설명
3. **브라우저 개발자 도구** 에러 메시지 확인

---

💡 **팁**: Root Directory 설정이 가장 중요합니다. 이것만 올바르게 설정해도 90% 문제가 해결됩니다! 