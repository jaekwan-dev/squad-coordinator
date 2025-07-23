import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginButton from './components/LoginButton';
import UserProfile from './components/UserProfile';
import Toaster from 'react-hot-toast';
import './App.css';

function AuthenticatedApp() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚽</div>
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">SoccerSquad</h1>
          <p className="text-gray-600 text-lg">축구 동호회 관리 시스템</p>
        </header>
        
        <main className="max-w-2xl mx-auto">
          {user ? (
            // 로그인된 상태
            <div className="space-y-8">
              <UserProfile />
              
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">🎉 카카오 로그인 완료!</h2>
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500">✅</span>
                    <span>프로젝트 구조 설정 완료</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500">✅</span>
                    <span>카카오 로그인 연동 완료</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-yellow-500">🔄</span>
                    <span>팀원 관리 시스템 개발 중</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-yellow-500">🔄</span>
                    <span>경기 일정 및 출석 투표 시스템 개발 중</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-yellow-500">🔄</span>
                    <span>자동 팀 편성 알고리즘 구현 중</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // 로그인되지 않은 상태
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">로그인이 필요합니다</h2>
              <p className="text-gray-600 text-center mb-8">
                축구 동호회 관리 시스템을 이용하려면 카카오 계정으로 로그인해주세요.
              </p>
              
              <div className="flex justify-center mb-8">
                <LoginButton />
              </div>
              
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <span>✨</span>
                  <span>팀원 등록 및 포지션 관리</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📅</span>
                  <span>경기 일정 등록 및 출석 투표</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⚽</span>
                  <span>자동 팀 편성 시스템</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>관리자 기능 (총무 전용)</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-gray-500">
              개발 진행 상황은 
              <a 
                href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api-docs`}
                className="text-blue-500 hover:underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                API 문서
              </a>
              에서 확인하세요
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          }
        }}
      />
    </AuthProvider>
  );
}

export default App 