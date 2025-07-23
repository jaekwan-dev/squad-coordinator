import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileEditFormProps {
  onCancel: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ onCancel }) => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    position_main: user?.position_main || 'CAM',
    position_sub: user?.position_sub || []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const positionCategories = [
    {
      category: '골키퍼',
      icon: '⚽',
      color: 'yellow',
      positions: [
        { value: 'GK', label: '골키퍼', description: 'Goalkeeper' }
      ]
    },
    {
      category: '수비수',
      icon: '🛡',
      color: 'blue',
      positions: [
        { value: 'CB', label: '센터백', description: 'Center Back' },
        { value: 'LB', label: '풀백 (왼쪽)', description: 'Left Back' },
        { value: 'RB', label: '풀백 (오른쪽)', description: 'Right Back' }
      ]
    },
    {
      category: '미드필더',
      icon: '🧠',
      color: 'green',
      positions: [
        { value: 'CDM', label: '수비형 미드필더', description: 'Central Defensive Mid' },
        { value: 'CM', label: '중앙 미드필더', description: 'Central Midfielder' },
        { value: 'CAM', label: '공격형 미드필더', description: 'Central Attacking Mid' }
      ]
    },
    {
      category: '공격수',
      icon: '🚀',
      color: 'red',
      positions: [
        { value: 'LW', label: '윙어 (왼쪽)', description: 'Left Winger' },
        { value: 'RW', label: '윙어 (오른쪽)', description: 'Right Winger' },
        { value: 'CF', label: '센터 포워드', description: 'Center Forward' }
      ]
    }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap = {
      yellow: isSelected ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300',
      blue: isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300',
      green: isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300',
      red: isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.green;
  };

  const getBadgeColor = (color: string) => {
    const colorMap = {
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.green;
  };

  const handleMainPositionChange = (position: string) => {
    setFormData(prev => ({
      ...prev,
      position_main: position,
      // 주 포지션이 변경되면 부 포지션에서 제거
      position_sub: prev.position_sub.filter(pos => pos !== position)
    }));
  };

  const handleSubPositionChange = (position: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        // 주 포지션과 같은 경우 추가하지 않음
        if (position === prev.position_main) return prev;
        return {
          ...prev,
          position_sub: [...prev.position_sub, position]
        };
      } else {
        return {
          ...prev,
          position_sub: prev.position_sub.filter(pos => pos !== position)
        };
      }
    });
  };

  const getSubPositionClasses = (category: any, isMainPosition: boolean, isChecked: boolean) => {
    if (isMainPosition) {
      return 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50';
    }
    
    if (isChecked) {
      switch (category.color) {
        case 'yellow': return 'border-yellow-500 bg-yellow-50 cursor-pointer';
        case 'blue': return 'border-blue-500 bg-blue-50 cursor-pointer';
        case 'green': return 'border-green-500 bg-green-50 cursor-pointer';
        case 'red': return 'border-red-500 bg-red-50 cursor-pointer';
        default: return 'border-green-500 bg-green-50 cursor-pointer';
      }
    }
    
    return 'border-gray-200 hover:border-gray-300 cursor-pointer';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile({
        position_main: formData.position_main,
        position_sub: formData.position_sub
      });
      onCancel(); // 편집 모드 종료
    } catch (error) {
      // 에러는 AuthContext에서 처리됨
    } finally {
      setIsSubmitting(false);
    }
  };

  const findPositionInfo = (positionValue: string) => {
    for (const category of positionCategories) {
      const position = category.positions.find(p => p.value === positionValue);
      if (position) return { ...position, category: category.category, color: category.color };
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">프로필 편집</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 주 포지션 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-4">
            주 포지션 (필수)
          </label>
          
          {positionCategories.map((category) => (
            <div key={category.category} className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">{category.icon}</span>
                {category.category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {category.positions.map((position) => (
                  <label
                    key={position.value}
                    className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${getColorClasses(category.color, formData.position_main === position.value)}`}
                  >
                    <input
                      type="radio"
                      name="position_main"
                      value={position.value}
                      checked={formData.position_main === position.value}
                      onChange={(e) => handleMainPositionChange(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold text-gray-900 text-center">
                      {position.label}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      {position.description}
                    </span>
                    {formData.position_main === position.value && (
                      <div className={`absolute top-2 right-2 w-4 h-4 ${getBadgeColor(category.color)} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 부 포지션 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-4">
            부 포지션 (선택사항)
          </label>
          <p className="text-xs text-gray-500 mb-4">
            여러 포지션을 선택할 수 있습니다. 주 포지션은 선택할 수 없습니다.
          </p>
          
          {positionCategories.map((category) => (
            <div key={`sub-${category.category}`} className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">{category.icon}</span>
                {category.category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {category.positions.map((position) => {
                  const isMainPosition = formData.position_main === position.value;
                  const isChecked = formData.position_sub.includes(position.value);
                  
                  return (
                    <label
                      key={position.value}
                      className={`relative flex flex-col items-center p-3 border-2 rounded-lg transition-colors ${getSubPositionClasses(category, isMainPosition, isChecked)}`}
                    >
                      <input
                        type="checkbox"
                        value={position.value}
                        checked={isChecked}
                        disabled={isMainPosition}
                        onChange={(e) => handleSubPositionChange(position.value, e.target.checked)}
                        className="sr-only"
                      />
                      <span className="text-sm font-semibold text-gray-900 text-center">
                        {position.label}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 text-center">
                        {position.description}
                      </span>
                      {isMainPosition && (
                        <span className="text-xs text-gray-400 mt-1">주 포지션</span>
                      )}
                      {isChecked && !isMainPosition && (
                        <div className={`absolute top-2 right-2 w-4 h-4 ${getBadgeColor(category.color)} rounded-full flex items-center justify-center`}>
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 현재 선택 요약 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">선택 요약</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">주 포지션:</span>{' '}
              {(() => {
                const mainInfo = findPositionInfo(formData.position_main);
                return (
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    mainInfo?.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    mainInfo?.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    mainInfo?.color === 'green' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {mainInfo?.category} • {mainInfo?.label}
                  </span>
                );
              })()}
            </div>
            <div>
              <span className="text-sm font-medium">부 포지션:</span>{' '}
              {formData.position_sub.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.position_sub.map(pos => {
                    const subInfo = findPositionInfo(pos);
                    return (
                      <span 
                        key={pos}
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          subInfo?.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          subInfo?.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                          subInfo?.color === 'green' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {subInfo?.label}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-gray-500 text-sm">선택하지 않음</span>
              )}
            </div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm; 