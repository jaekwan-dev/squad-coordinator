import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileEditFormProps {
  onCancel: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ onCancel }) => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    position_main: user?.position_main || 'MF',
    position_sub: user?.position_sub || []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const positions = [
    { value: 'GK', label: '골키퍼', description: 'Goal Keeper' },
    { value: 'DF', label: '수비수', description: 'Defender' },
    { value: 'MF', label: '미드필더', description: 'Midfielder' },
    { value: 'FW', label: '공격수', description: 'Forward' }
  ];

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
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
          <label className="block text-sm font-medium text-gray-600 mb-3">
            주 포지션 (필수)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {positions.map((position) => (
              <label
                key={position.value}
                className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.position_main === position.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="position_main"
                  value={position.value}
                  checked={formData.position_main === position.value}
                  onChange={(e) => handleMainPositionChange(e.target.value)}
                  className="sr-only"
                />
                <span className="text-lg font-semibold text-gray-900">
                  {position.label}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {position.description}
                </span>
                {formData.position_main === position.value && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* 부 포지션 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-3">
            부 포지션 (선택사항)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            여러 포지션을 선택할 수 있습니다. 주 포지션은 선택할 수 없습니다.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {positions.map((position) => {
              const isMainPosition = formData.position_main === position.value;
              const isChecked = formData.position_sub.includes(position.value);
              
              return (
                <label
                  key={position.value}
                  className={`relative flex flex-col items-center p-3 border-2 rounded-lg transition-colors ${
                    isMainPosition
                      ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                      : isChecked
                      ? 'border-blue-500 bg-blue-50 cursor-pointer'
                      : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={position.value}
                    checked={isChecked}
                    disabled={isMainPosition}
                    onChange={(e) => handleSubPositionChange(position.value, e.target.checked)}
                    className="sr-only"
                  />
                  <span className="text-lg font-semibold text-gray-900">
                    {position.label}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {position.description}
                  </span>
                  {isMainPosition && (
                    <span className="text-xs text-gray-400 mt-1">주 포지션</span>
                  )}
                  {isChecked && !isMainPosition && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* 현재 선택 요약 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">선택 요약</h3>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">주 포지션:</span>{' '}
              <span className="text-green-600">
                {positions.find(p => p.value === formData.position_main)?.label}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-medium">부 포지션:</span>{' '}
              {formData.position_sub.length > 0 ? (
                <span className="text-blue-600">
                  {formData.position_sub.map(pos => 
                    positions.find(p => p.value === pos)?.label
                  ).join(', ')}
                </span>
              ) : (
                <span className="text-gray-500">선택하지 않음</span>
              )}
            </p>
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