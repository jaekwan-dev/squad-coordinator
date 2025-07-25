import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import LoginButton from './components/LoginButton';
import UserProfile from './components/UserProfile';
import UpcomingMatch from './components/UpcomingMatch';
import MatchesPage from './pages/MatchesPage';
import MatchDetailPage from './pages/MatchDetailPage';
import CreateMatchPage from './pages/CreateMatchPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/matches/create" element={<CreateMatchPage />} />
            <Route path="/matches/:id" element={<MatchDetailPage />} />
            <Route path="/auth/success" element={<AuthSuccessPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// 홈페이지 컴포넌트
function HomePage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">FC Bro Manager</h1>
        <p className="text-gray-600">축구팀 관리 시스템</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 다가오는 경기 */}
        <div className="lg:col-span-2">
          <UpcomingMatch />
        </div>
        
        {/* 사용자 프로필 */}
        <div>
          <UserProfile />
        </div>
      </div>
      
      {/* 빠른 네비게이션 */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">빠른 메뉴</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/matches"
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="text-2xl">📅</span>
            <div>
              <div className="font-medium text-blue-800">경기 일정</div>
              <div className="text-sm text-blue-600">모든 경기 보기</div>
            </div>
          </a>
          
          <a
            href="/matches"
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span className="text-2xl">🗳️</span>
            <div>
              <div className="font-medium text-green-800">참석 투표</div>
              <div className="text-sm text-green-600">참석 의사 표시</div>
            </div>
          </a>
          
          <a
            href="/"
            className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors opacity-50 cursor-not-allowed"
          >
            <span className="text-2xl">👥</span>
            <div>
              <div className="font-medium text-purple-800">팀 편성</div>
              <div className="text-sm text-purple-600">준비 중</div>
            </div>
          </a>
          
          <a
            href="/"
            className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors opacity-50 cursor-not-allowed"
          >
            <span className="text-2xl">📊</span>
            <div>
              <div className="font-medium text-orange-800">통계</div>
              <div className="text-sm text-orange-600">준비 중</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

// 인증 성공 페이지
function AuthSuccessPage() {
  return (
    <div className="max-w-md mx-auto p-6 min-h-screen flex items-center">
      <div className="w-full">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">FC Bro Manager</h1>
          <p className="text-gray-600">축구팀 관리 시스템</p>
        </div>
        
        <div className="space-y-4">
          <LoginButton />
          <UserProfile />
        </div>
        
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            홈으로 가기 →
          </a>
        </div>
      </div>
    </div>
  );
}

export default App; 