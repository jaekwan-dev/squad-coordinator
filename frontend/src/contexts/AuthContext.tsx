import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  position_main: string;
  position_sub: string[];
  level: number;
  is_admin: boolean;
  profile_image?: string; // 프로필 이미지 URL 추가
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (profileData: { position_main?: string; position_sub?: string[] }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 카카오 SDK 초기화
  useEffect(() => {
    const kakaoAppKey = import.meta.env.VITE_KAKAO_CLIENT_ID;
    if (kakaoAppKey && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoAppKey);
    }
  }, []);

  // 토큰에서 사용자 정보 로드
  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // 토큰을 axios 기본 헤더에 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 사용자 프로필 조회
        const response = await axios.get('/auth/profile');
        setUser(response.data);
      } catch (error) {
        console.error('토큰 검증 실패:', error);
        // 유효하지 않은 토큰 제거
        localStorage.removeItem('access_token');
        delete axios.defaults.headers.common['Authorization'];
        toast.error('로그인이 만료되었습니다. 다시 로그인해주세요.');
      }
      
      setIsLoading(false);
    };

    loadUserFromToken();
  }, []);

  // URL에서 토큰 처리 (카카오 로그인 콜백 후)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('access_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // URL에서 토큰 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // 사용자 정보 새로고침
      refreshUser();
      toast.success('로그인 성공!');
    }
  }, []);

  const login = () => {
    // 백엔드 카카오 로그인 엔드포인트로 이동
    window.location.href = `${API_BASE_URL}/auth/kakao`;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('로그아웃되었습니다.');
  };

  const refreshUser = async () => {
    try {
      const response = await axios.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('사용자 정보 새로고침 실패:', error);
    }
  };

  const updateProfile = async (profileData: { position_main?: string; position_sub?: string[] }) => {
    try {
      console.log('🔍 [Profile Update] Updating profile:', profileData);
      
      const response = await axios.patch('/auth/profile', profileData);
      
      // 업데이트된 사용자 정보로 상태 갱신
      setUser(response.data.user);
      
      console.log('✅ [Profile Update] Profile updated successfully');
      toast.success('프로필이 성공적으로 업데이트되었습니다!');
    } catch (error) {
      console.error('❌ [Profile Update] Failed to update profile:', error);
      toast.error('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      refreshUser,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다.');
  }
  return context;
};

// 전역 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
} 