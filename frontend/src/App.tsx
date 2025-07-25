import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginButton from './components/LoginButton';
import UserProfile from './components/UserProfile';
import { Toaster } from 'react-hot-toast';
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
            </div>
          ) : (
            // 로그인되지 않은 상태
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-gray-600 text-center mb-8">
                축구 동호회 관리 시스템을 이용하려면 카카오 계정으로 로그인해주세요.
              </p>
              
              <div className="flex justify-center mb-8">
                <LoginButton />
              </div>
              
              
            </div>
          )}
          
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