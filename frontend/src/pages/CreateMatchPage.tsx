import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { matchService, CreateMatchRequest } from '../services/matchService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CreateMatchPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreateMatchRequest>({
    title: '',
    match_date: '',
    match_time: '14:00',
    location: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  // 로그인하지 않은 사용자는 리다이렉트
  useEffect(() => {
    if (user === null) {
      toast.error('로그인이 필요합니다.');
      navigate('/auth/success');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (!formData.title.trim() || !formData.match_date || !formData.match_time || !formData.location.trim()) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 날짜 검증 (과거 날짜 불가)
    const selectedDate = new Date(formData.match_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('과거 날짜는 선택할 수 없습니다.');
      return;
    }

    try {
      setLoading(true);
      const newMatch = await matchService.createMatch(formData);
      toast.success('경기가 성공적으로 등록되었습니다!');
      navigate(`/matches/${newMatch.id}`);
    } catch (error) {
      console.error('경기 생성 실패:', error);
      toast.error('경기 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중 또는 사용자 정보가 없을 때
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="text-gray-400 text-6xl mb-4">🔐</div>
        <h2 className="text-xl font-semibold text-gray-600 mb-2">로그인이 필요합니다</h2>
        <p className="text-gray-500 mb-4">경기를 등록하려면 로그인해주세요.</p>
        <Link to="/auth/success" className="text-blue-600 hover:text-blue-700">
          로그인하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <Link 
          to="/matches"
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
        >
          <span>←</span>
          <span>경기 목록으로</span>
        </Link>
      </div>

      {/* 페이지 제목 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">새 경기 등록</h1>
        <p className="text-gray-600">팀원들이 참여할 수 있는 새로운 경기를 등록하세요.</p>
      </div>

      {/* 경기 등록 폼 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 경기 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              경기 제목 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="예: 토요일 정기전"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* 날짜 및 시간 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="match_date" className="block text-sm font-medium text-gray-700 mb-2">
                경기 날짜 *
              </label>
              <input
                type="date"
                id="match_date"
                name="match_date"
                value={formData.match_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="match_time" className="block text-sm font-medium text-gray-700 mb-2">
                경기 시간 *
              </label>
              <input
                type="time"
                id="match_time"
                name="match_time"
                value={formData.match_time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* 경기 장소 */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              경기 장소 *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="예: 서울월드컵경기장 보조구장"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* 경기 설명 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              경기 설명
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="경기에 대한 추가 정보를 입력하세요. (선택사항)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              예: 준비물, 주의사항, 특별한 안내사항 등
            </p>
          </div>

          {/* 미리보기 */}
          {(formData.title || formData.match_date || formData.location) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">미리보기</h3>
              <div className="space-y-2 text-sm">
                {formData.title && (
                  <div className="font-semibold text-gray-800">{formData.title}</div>
                )}
                {formData.match_date && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span>📅</span>
                    <span>
                      {new Date(formData.match_date + 'T00:00:00').toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                      {formData.match_time && (
                        <span className="ml-2">
                          {(() => {
                            const [hours, minutes] = formData.match_time.split(':');
                            const hour = parseInt(hours);
                            const ampm = hour >= 12 ? '오후' : '오전';
                            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                            return `${ampm} ${displayHour}:${minutes}`;
                          })()}
                        </span>
                      )}
                    </span>
                  </div>
                )}
                {formData.location && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span>📍</span>
                    <span>{formData.location}</span>
                  </div>
                )}
                {formData.description && (
                  <div className="text-gray-600 mt-2">
                    <div className="text-xs text-gray-500 mb-1">설명:</div>
                    <div className="whitespace-pre-wrap">{formData.description}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 버튼 그룹 */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/matches')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '등록 중...' : '경기 등록'}
            </button>
          </div>
        </form>
      </div>

      {/* 도움말 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">💡 경기 등록 가이드</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 모든 팀원이 경기를 등록할 수 있습니다.</li>
          <li>• 경기 제목은 팀원들이 쉽게 알아볼 수 있도록 명확하게 작성하세요.</li>
          <li>• 날짜와 시간을 정확히 입력하여 혼선을 방지하세요.</li>
          <li>• 경기 장소는 주소나 랜드마크를 포함하여 구체적으로 적어주세요.</li>
          <li>• 필요한 준비물이나 주의사항이 있다면 설명에 추가하세요.</li>
          <li>• 등록한 경기는 본인이 직접 수정하고 삭제할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateMatchPage; 