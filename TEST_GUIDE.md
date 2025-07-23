# 🧪 카카오 로그인 테스트 가이드

SoccerSquad의 카카오 로그인 기능을 테스트하는 방법을 안내합니다.

## 📋 사전 준비

1. ✅ 카카오 개발자 설정 완료 ([KAKAO_SETUP.md](./KAKAO_SETUP.md) 참고)
2. ✅ Supabase 프로젝트 설정 및 사용자 테이블 생성
3. ✅ 환경변수 설정 완료
4. ✅ 백엔드/프론트엔드 서버 실행

## 🚀 서버 실행

### 1. 백엔드 서버 실행
```bash
cd backend
npm install
npm run start:dev
```
✅ **확인**: http://localhost:3001 접속하여 "⚽ SoccerSquad Backend API is running!" 메시지 확인

### 2. 프론트엔드 서버 실행
```bash
cd frontend  
npm install
npm run dev
```
✅ **확인**: http://localhost:3000 접속하여 SoccerSquad 메인 페이지 확인

### 3. API 문서 확인
브라우저에서 http://localhost:3001/api-docs 접속하여 Swagger 문서 확인

## 🔐 로그인 테스트 시나리오

### 시나리오 1: 첫 회원가입
1. http://localhost:3000 접속
2. "카카오 로그인" 버튼 클릭
3. 카카오 로그인 페이지에서 인증
4. 자동으로 http://localhost:3000으로 리다이렉트
5. ✅ **예상 결과**: 
   - "로그인 성공!" 토스트 메시지
   - 사용자 프로필 카드 표시
   - 기본값으로 설정된 정보 확인:
     - 주 포지션: 미드필더(MF)
     - 레벨: 3 (중급)
     - 관리자 권한: false

### 시나리오 2: 기존 사용자 로그인
1. 로그아웃 버튼 클릭
2. 다시 "카카오 로그인" 버튼 클릭
3. ✅ **예상 결과**: 
   - 기존 사용자 정보 유지
   - 이전에 설정된 포지션/레벨 그대로 표시

### 시나리오 3: 토큰 만료 테스트
1. 개발자 도구 > Application > Local Storage에서 `access_token` 수정
2. 페이지 새로고침
3. ✅ **예상 결과**: 
   - "로그인이 만료되었습니다" 토스트 메시지
   - 자동으로 로그아웃 상태로 전환

## 🛠️ 디버깅 방법

### 백엔드 로그 확인
```bash
cd backend
npm run start:dev
```
콘솔에서 다음 로그들을 확인:
- `🚀 SoccerSquad Backend is running on: http://localhost:3001`
- `📚 API Documentation: http://localhost:3001/api-docs`
- 카카오 로그인 시: `Kakao Profile: { ... }` 객체 출력

### 프론트엔드 로그 확인
브라우저 개발자 도구 > Console에서:
- 네트워크 요청 상태 확인
- 에러 메시지 확인
- `axios` 요청/응답 로그 확인

### 네트워크 요청 확인
브라우저 개발자 도구 > Network 탭에서:
1. `/auth/kakao` - 카카오 로그인 리다이렉트
2. `/auth/kakao/callback` - 콜백 처리
3. `/auth/profile` - 사용자 정보 조회

## ❌ 자주 발생하는 오류

### 1. "카카오 앱키가 없습니다"
**원인**: VITE_KAKAO_CLIENT_ID가 설정되지 않음
**해결**: `.env.local`에 JavaScript 키 설정

### 2. CORS 에러
**원인**: 백엔드 CORS 설정 또는 Redirect URI 불일치
**해결**: 
- 백엔드가 3001 포트에서 실행 중인지 확인
- 카카오 콜백 URL이 정확한지 확인

### 3. "사용자를 찾을 수 없습니다"
**원인**: Supabase 연결 실패 또는 테이블 부재
**해결**: 
- Supabase 환경변수 확인
- Users 테이블 생성 확인

### 4. "토큰이 무효합니다"
**원인**: JWT_SECRET 불일치
**해결**: 백엔드 환경변수에서 JWT_SECRET 확인

## 📊 성공 기준

- [ ] 카카오 로그인 버튼이 정상적으로 동작
- [ ] 카카오 계정 인증 후 자동 회원가입
- [ ] 사용자 프로필 정보 정상 표시
- [ ] 로그아웃 기능 정상 동작
- [ ] 토큰 만료 시 자동 로그아웃
- [ ] 기존 사용자 재로그인 시 정보 유지

## 🔄 다음 단계

카카오 로그인이 성공적으로 동작한다면:
1. 사용자 프로필 편집 기능 추가
2. 경기 일정 관리 기능 개발
3. 출석 투표 시스템 구현
4. 자동 팀 편성 알고리즘 개발

---

문제가 발생하면 백엔드/프론트엔드 로그를 확인하고, [이슈](https://github.com/your-repo/issues)에 상세한 오류 내용을 공유해 주세요. 