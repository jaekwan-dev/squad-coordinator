import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchService, Match } from '../services/matchService';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const UpcomingMatch = () => {
  const { user } = useAuth();
  const [upcomingMatch, setUpcomingMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [myVote, setMyVote] = useState<'attending' | 'not_attending' | null>(null);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    loadUpcomingMatch();
  }, []);

  useEffect(() => {
    if (upcomingMatch?.id && user) {
      loadMyVote();
    }
  }, [upcomingMatch?.id, user]);

  const loadUpcomingMatch = async () => {
    try {
      setLoading(true);
      const matches = await matchService.getUpcomingMatches(1);
      setUpcomingMatch(matches.length > 0 ? matches[0] : null);
    } catch (error) {
      console.error('다가오는 경기 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyVote = async () => {
    if (!upcomingMatch?.id || !user) return;
    
    try {
      const vote = await attendanceService.getMyVote(upcomingMatch.id);
      setMyVote(vote?.status || null);
    } catch (error) {
      console.error('내 투표 정보 로드 실패:', error);
    }
  };

  const handleQuickVote = async (status: 'attending' | 'not_attending') => {
    if (!upcomingMatch?.id || !user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      setVoting(true);
      
      if (myVote) {
        // 기존 투표 수정
        await attendanceService.updateVote(upcomingMatch.id, { status });
      } else {
        // 새 투표
        await attendanceService.vote({
          match_id: upcomingMatch.id,
          status
        });
      }

      setMyVote(status);
      toast.success(status === 'attending' ? '참석 투표 완료!' : '불참 투표 완료!');
      
      // 경기 정보 다시 로드
      await loadUpcomingMatch();
    } catch (error) {
      console.error('투표 실패:', error);
      toast.error('투표에 실패했습니다.');
    } finally {
      setVoting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
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

  const getAttendanceStats = () => {
    if (!upcomingMatch?.attendances) return { attending: 0, total: 0 };
    
    const attending = upcomingMatch.attendances.filter(a => a.status === 'attending').length;
    const total = upcomingMatch.attendances.length;
    
    return { attending, total };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!upcomingMatch) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-400 text-4xl mb-3">📅</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">예정된 경기가 없습니다</h3>
        <p className="text-gray-500 mb-4">새로운 경기가 등록되면 여기에 표시됩니다.</p>
        <Link
          to="/matches"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          모든 경기 보기 →
        </Link>
      </div>
    );
  }

  const stats = getAttendanceStats();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">다가오는 경기</h2>
        <Link
          to={`/matches/${upcomingMatch.id}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          자세히 보기 →
        </Link>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {upcomingMatch.title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span>📅</span>
            <span>{formatDate(upcomingMatch.match_date)} {formatTime(upcomingMatch.match_time)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <span>{upcomingMatch.location}</span>
          </div>
        </div>
      </div>

      {/* 참석 현황 */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-blue-700 text-sm">참석 현황</span>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-blue-800 font-medium">
                🟢 {stats.attending}명 참석
              </span>
              <span className="text-blue-600 text-sm">
                총 {stats.total}명 투표
              </span>
            </div>
          </div>
          
          {myVote && (
            <div className="text-right">
              <div className="text-xs text-blue-600">내 투표</div>
              <div className={`text-sm font-medium ${
                myVote === 'attending' ? 'text-green-700' : 'text-red-700'
              }`}>
                {myVote === 'attending' ? '🟢 참석' : '🔴 불참'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 빠른 투표 */}
      {user && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">
            {myVote ? '투표 변경' : '참석 투표'}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickVote('attending')}
              disabled={voting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                myVote === 'attending'
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              🟢 참석
            </button>
            <button
              onClick={() => handleQuickVote('not_attending')}
              disabled={voting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                myVote === 'not_attending'
                  ? 'bg-red-100 text-red-800 border-2 border-red-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              🔴 불참
            </button>
          </div>
        </div>
      )}

      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-800 text-sm text-center">
            투표하려면 <Link to="/auth/success" className="font-medium underline">로그인</Link>하세요
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingMatch; 