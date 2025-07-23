# 🔧 Render 환경변수 강제 업데이트 가이드

## 🚨 로컬에서는 정상, 서버에서는 500 에러 해결

### 문제 증상
- 로컬: http://localhost:3001/auth/kakao/callback → 302 정상
- 서버: https://squad-coordinator.onrender.com/auth/kakao/callback → 500 에러

### 가장 가능성 높은 원인
1. **Render 환경변수 로드 실패**
2. **Supabase users 테이블 미생성**
3. **캐시된 환경변수**

## 🔧 즉시 해결 방법

### 1단계: 환경변수 완전 재설정

Render 대시보드에서 모든 환경변수를 **삭제 후 재생성**:

1. **Environment** 탭 → 기존 변수들 **모두 Delete**
2. 다음 8개 변수를 **새로 추가**:

```bash
SUPABASE_URL=https://nughewbiuwnoaagwkcpg.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2hld2JpdXdub2FhZ3drY3BnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzNjIyNiwiZXhwIjoyMDY4ODEyMjI2fQ.Ys5JKlGgnxXUaDsMNgZMMB31U
KAKAO_CLIENT_ID=f3faa68dd073b9ffdd2cfc7bfabdf07f
KAKAO_CLIENT_SECRET=KWccHkGvlbPtKEug6pNRvPia5D96stLE
KAKAO_CALLBACK_URL=https://squad-coordinator.onrender.com/auth/kakao/callback
JWT_SECRET=soccer-squad-production-jwt-2025-render-secure
NODE_ENV=production
FRONTEND_URL=https://squad-coordinator.vercel.app
```

### 2단계: 서비스 강제 재시작

**Settings** 탭 → **Restart Service** 클릭

### 3단계: Clear Build Cache

**Settings** 탭 → **Clear Build Cache** → **Manual Deploy**

## 🔍 디버깅 로그 확인

재배포 후 **Logs** 탭에서 확인해야 할 메시지:

### ✅ 성공 패턴:
```
🔍 Environment Variables Check:
NODE_ENV: production
SUPABASE_URL: Set ✅
SUPABASE_SERVICE_KEY: Set ✅
✅ Supabase client initialized successfully
🚀 SoccerSquad Backend is running on: https://squad-coordinator.onrender.com

# 카카오 로그인 시도 시:
🔍 [Kakao Auth] Starting validation process...
🔍 [Kakao Auth] Profile data: { kakaoId: 'kakao_xxxxx', ... }
🔍 [Kakao Auth] Checking for existing user...
🔍 [Kakao Auth] User not found, creating new user...
✅ [Kakao Auth] New user created successfully: kakao_xxxxx
✅ [Kakao Auth] Validation completed successfully
```

### ❌ 실패 패턴들:

#### 환경변수 문제:
```
SUPABASE_URL: Missing ❌
SUPABASE_SERVICE_KEY: Missing ❌
❌ SUPABASE_URL environment variable is required
```

#### 테이블 없음:
```
❌ [Kakao Auth] Validation failed: relation "users" does not exist
```

#### 권한 문제:
```
❌ [Kakao Auth] Validation failed: permission denied for table users
```

## 🧪 테스트 절차

1. **환경변수 재설정** 완료
2. **재배포** 완료 
3. **로그 확인**: "Set ✅" 메시지 확인
4. **카카오 로그인 테스트**: https://squad-coordinator.onrender.com/auth/kakao
5. **실시간 로그 모니터링**: [Kakao Auth] 메시지들 확인

## 💡 추가 문제 해결

### 문제: "relation 'users' does not exist"
**해결**: Supabase SQL Editor에서 데이터베이스 스키마 실행

### 문제: "permission denied for table users"
**해결**: Supabase에서 RLS 정책 비활성화 확인
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### 문제: JWT 토큰 생성 실패
**해결**: JWT_SECRET 환경변수 확인

---

💡 **핵심**: 로컬에서 되고 서버에서 안 되는 문제는 99% 환경변수나 데이터베이스 설정 차이입니다! 