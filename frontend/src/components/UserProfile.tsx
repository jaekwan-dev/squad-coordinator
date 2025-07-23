import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileEditForm from './ProfileEditForm';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  // 편집 모드일 때는 편집 폼을 표시
  if (isEditing) {
    return <ProfileEditForm onCancel={() => setIsEditing(false)} />;
  }

  const positionData = {
    // 골키퍼
    'GK': { label: '골키퍼', category: '골키퍼', color: 'yellow', icon: '⚽' },
    
    // 수비수
    'CB': { label: '센터백', category: '수비수', color: 'blue', icon: '🛡' },
    'LB': { label: '풀백 (왼쪽)', category: '수비수', color: 'blue', icon: '🛡' },
    'RB': { label: '풀백 (오른쪽)', category: '수비수', color: 'blue', icon: '🛡' },
    
    // 미드필더
    'CDM': { label: '수비형 미드필더', category: '미드필더', color: 'green', icon: '🧠' },
    'CM': { label: '중앙 미드필더', category: '미드필더', color: 'green', icon: '🧠' },
    'CAM': { label: '공격형 미드필더', category: '미드필더', color: 'green', icon: '🧠' },
    
    // 공격수
    'LW': { label: '윙어 (왼쪽)', category: '공격수', color: 'red', icon: '🚀' },
    'RW': { label: '윙어 (오른쪽)', category: '공격수', color: 'red', icon: '🚀' },
    'CF': { label: '센터 포워드', category: '공격수', color: 'red', icon: '🚀' },
    
    // 기존 레거시 포지션들 (하위 호환성)
    'DF': { label: '수비수', category: '수비수', color: 'blue', icon: '🛡' },
    'MF': { label: '미드필더', category: '미드필더', color: 'green', icon: '🧠' },
    'FW': { label: '공격수', category: '공격수', color: 'red', icon: '🚀' },
    
    // 제거된 포지션들의 호환성 매핑
    'LWB': { label: '풀백 (왼쪽)', category: '수비수', color: 'blue', icon: '🛡' },
    'RWB': { label: '풀백 (오른쪽)', category: '수비수', color: 'blue', icon: '🛡' },
    'LM': { label: '미드필더', category: '미드필더', color: 'green', icon: '🧠' },
    'RM': { label: '미드필더', category: '미드필더', color: 'green', icon: '🧠' },
    'ST': { label: '센터 포워드', category: '공격수', color: 'red', icon: '🚀' }
  };

  const getPositionInfo = (position: string) => {
    return positionData[position as keyof typeof positionData] || { 
      label: position, 
      category: '기타', 
      color: 'gray', 
      icon: '⚪' 
    };
  };

  const getPositionBadgeColor = (color: string) => {
    const colorMap = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const getLevelText = (level: number) => {
    const levelMap: { [key: number]: string } = {
      1: '초급',
      2: '초중급',
      3: '중급',
      4: '중상급',
      5: '고급'
    };
    return levelMap[level] || `레벨 ${level}`;
  };

  const mainPositionInfo = getPositionInfo(user.position_main);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">프로필</h2>
        <div className="flex items-center space-x-2">
          {user.is_admin && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full border">
              관리자
            </span>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            편집
          </button>
        </div>
      </div>
      
      {/* 프로필 이미지 섹션 */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt={`${user.name}의 프로필`}
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 shadow-lg"
              onError={(e) => {
                // 이미지 로드 실패 시 기본 아바타로 대체
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          
          {/* 기본 아바타 (이미지가 없거나 로드 실패 시) */}
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg ${user.profile_image ? 'hidden' : ''}`}>
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">이름</label>
          <div className="text-lg font-semibold text-gray-900">{user.name}</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">주 포지션</label>
          <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border ${getPositionBadgeColor(mainPositionInfo.color)}`}>
            <span className="mr-2">{mainPositionInfo.icon}</span>
            <div className="flex flex-col">
              <span className="font-semibold">{mainPositionInfo.label}</span>
              <span className="text-xs opacity-75">{mainPositionInfo.category}</span>
            </div>
          </div>
        </div>
        
        {user.position_sub && user.position_sub.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">부 포지션</label>
            <div className="flex flex-wrap gap-2">
              {user.position_sub.map((pos, index) => {
                const posInfo = getPositionInfo(pos);
                return (
                  <span 
                    key={index}
                    className={`inline-flex items-center px-2 py-1 rounded text-sm border ${getPositionBadgeColor(posInfo.color)}`}
                  >
                    <span className="mr-1 text-xs">{posInfo.icon}</span>
                    {posInfo.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">실력 레벨</label>
          <div className="flex items-center space-x-2">
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm border border-orange-200">
              {getLevelText(user.level)}
            </span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-4 h-4 rounded-full ${
                    star <= user.level ? 'bg-orange-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default UserProfile; 