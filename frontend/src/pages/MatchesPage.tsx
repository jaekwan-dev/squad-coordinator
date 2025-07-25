import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchService, Match } from '../services/matchService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const MatchesPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await matchService.getMatches();
      setMatches(data);
    } catch (error) {
      console.error('경기 목록 로드 실패:', error);
      toast.error('경기 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? '오후' : '오전';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${ampm} ${displayHour}:${minutes}`;
  };

  const isUpcoming = (matchDate: string) => {
    return new Date(matchDate) >= new Date(new Date().toDateString());
  };

  const getAttendanceCount = (match: Match) => {
    if (!match.attendances) return { attending: 0, total: 0 };
    
    const attending = match.attendances.filter(a => a.status === 'attending').length;
    const total = match.attendances.length;
    return { attending, total };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">경기 일정</h1>
        {user && (
          <Link
            to="/matches/create"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ➕ 경기 등록
          </Link>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">⚽</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">등록된 경기가 없습니다</h3>
          <p className="text-gray-500 mb-4">새로운 경기를 등록해주세요.</p>
          {user && (
            <Link
              to="/matches/create"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              첫 경기 등록하기
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => {
            const { attending, total } = getAttendanceCount(match);
            const upcoming = isUpcoming(match.match_date);
            
            return (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {match.title}
                        </h3>
                        {upcoming && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            예정
                          </span>
                        )}
                        {!upcoming && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            종료
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <span>📅</span>
                          <span>{formatDate(match.match_date)} {formatTime(match.match_time)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>📍</span>
                          <span>{match.location}</span>
                        </div>
                        {match.creator && (
                          <div className="flex items-center space-x-2">
                            <span>👤</span>
                            <span>주최: {match.creator.name}</span>
                          </div>
                        )}
                      </div>

                      {match.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {match.description}
                        </p>
                      )}
                    </div>

                    <div className="ml-6 text-right">
                      <div className="bg-blue-50 rounded-lg p-3 min-w-[100px]">
                        <div className="text-lg font-bold text-blue-800">
                          {attending}명
                        </div>
                        <div className="text-xs text-blue-600">
                          참석 / 총 {total}명
                        </div>
                      </div>
                    </div>
                  </div>

                  {upcoming && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          참석 투표를 위해 클릭하세요
                        </span>
                        <span className="text-blue-600 text-sm font-medium">
                          자세히 보기 →
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatchesPage; 