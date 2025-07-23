import { useAuth } from '../contexts/AuthContext';

const LoginButton = () => {
  const { login } = useAuth();

  return (
    <button
      onClick={login}
      className="flex items-center justify-center w-full max-w-sm mx-auto bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
    >
      <div className="flex items-center space-x-3">
        {/* 카카오 로고 */}
        <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
          <svg 
            viewBox="0 0 24 24" 
            className="w-4 h-4 fill-yellow-400"
          >
            <path d="M12 3c5.5 0 10 3.58 10 8 0 2.5-1.25 4.73-3.25 6.24L19.5 21l-3.5-.89c-.75.1-1.5.15-2.25.15-.55 0-1.08-.03-1.6-.09L8.5 21l.75-3.76C7.25 15.73 2 13.5 2 11c0-4.42 4.5-8 10-8z"/>
          </svg>
        </div>
        <span>카카오 로그인</span>
      </div>
    </button>
  );
};

export default LoginButton; 