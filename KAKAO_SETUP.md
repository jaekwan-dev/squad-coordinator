# 🔑 카카오 로그인 설정 가이드

SoccerSquad에서 카카오 로그인을 설정하는 방법을 안내합니다.

## 1. 카카오 개발자 계정 생성

1. [카카오 개발자 사이트](https://developers.kakao.com)에 접속
2. 카카오 계정으로 로그인
3. "내 애플리케이션"에서 "애플리케이션 추가하기" 클릭

## 2. 애플리케이션 설정

### 기본 정보
- **앱 이름**: SoccerSquad (또는 원하는 이름)
- **회사명**: 개인/팀명 입력
- **카테고리**: 스포츠

### 플랫폼 설정
"플랫폼" 탭에서 **웹 플랫폼** 추가:
- **사이트 도메인**: `http://localhost:3000` (개발 환경)
- **사이트 도메인**: `https://your-domain.com` (프로덕션 환경)

### Redirect URI 설정
"카카오 로그인" > "Redirect URI" 설정:
- **개발 환경**: `http://localhost:3001/auth/kakao/callback`
- **프로덕션 환경**: `https://your-api-domain.com/auth/kakao/callback`

### 동의항목 설정
"카카오 로그인" > "동의항목"에서 다음 설정:
- **닉네임**: 필수 동의 ✅
- **프로필 사진**: 선택 동의 (선택사항)

## 3. 앱 키 확인

"내 애플리케이션" > "앱 키"에서 다음 키들을 확인:
- **JavaScript 키**: 프론트엔드에서 사용
- **REST API 키**: 백엔드에서 Client ID로 사용
- **Client Secret**: 보안 강화를 위해 발급 (선택사항)

## 4. 환경변수 설정

### Backend (.env)
```bash
# Kakao OAuth
KAKAO_CLIENT_ID=your-rest-api-key
KAKAO_CLIENT_SECRET=your-client-secret  # 선택사항
KAKAO_CALLBACK_URL=http://localhost:3001/auth/kakao/callback
```

### Frontend (.env.local)
```bash
# Kakao OAuth
VITE_KAKAO_CLIENT_ID=your-javascript-key
```

## 5. 테스트 사용자 등록 (개발 중)

개발 단계에서는 "카카오 로그인" > "테스트 사용자"에 개발자 계정을 등록해야 합니다.

1. "테스트 사용자 관리" 클릭
2. 개발에 참여할 카카오 계정들을 등록
3. 등록된 계정만 개발 환경에서 로그인 가능

## 6. 서비스 환경 전환

개발 완료 후 실제 서비스를 위해 "앱 설정" > "서비스 환경"을 "개발 중"에서 "서비스 중"으로 변경합니다.

## 🚨 보안 주의사항

- **Client Secret**는 절대 프론트엔드에 노출하지 마세요
- **REST API 키**는 백엔드에서만 사용하세요
- **JavaScript 키**만 프론트엔드에서 사용하세요
- 환경변수 파일(.env)은 Git에 커밋하지 마세요

## 📞 문제해결

### 로그인 버튼 클릭 시 오류
- 카카오 JavaScript SDK가 제대로 로드되었는지 확인
- VITE_KAKAO_CLIENT_ID가 올바르게 설정되었는지 확인

### 콜백 오류 (CORS 에러)
- Redirect URI가 정확히 설정되었는지 확인
- 개발 환경에서는 http://localhost:3001/auth/kakao/callback

### 사용자 정보 없음
- 동의항목에서 닉네임이 필수로 설정되었는지 확인
- 테스트 사용자로 등록되었는지 확인

---

더 자세한 내용은 [카카오 개발자 가이드](https://developers.kakao.com/docs/latest/ko/kakaologin/common)를 참조하세요. 