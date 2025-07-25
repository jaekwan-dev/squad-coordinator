import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { matchService, Match } from '../services/matchService';
import { attendanceService, VoteRequest } from '../services/attendanceService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [myVote, setMyVote] = useState<'attending' | 'not_attending' | null>(null);

  useEffect(() => {
    if (id) {
      loadMatchDetail();
      if (user) {
        loadMyVote();
      }
    }
  }, [id, user]);

  const loadMatchDetail = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await matchService.getMatch(id);
      setMatch(data);
    } catch (error) {
      console.error('경기 상세 정보 로드 실패:', error);
      toast.error('경기 정보를 불러오는데 실패했습니다.');
      navigate('/matches');
    } finally {
      setLoading(false);
    }
  };

  const loadMyVote = async () => {
    if (!id || !user) return;
    
    try {
      const vote = await attendanceService.getMyVote(id);
      setMyVote(vote?.status || null);
    } catch (error) {
      console.error('내 투표 정보 로드 실패:', error);
    }
  };

  const handleVote = async (status: 'attending' | 'not_attending') => {
    if (!id || !user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      setVoting(true);
      
      const voteData: VoteRequest = {
        match_id: id,
        status
      };

      if (myVote) {
        // 기존 투표 수정
        await attendanceService.updateVote(id, { status });
      } else {
        // 새 투표
        await attendanceService.vote(voteData);
      }

      setMyVote(status);
      toast.success(status === 'attending' ? '참석 투표가 완료되었습니다!' : '불참 투표가 완료되었습니다!');
      
      // 경기 정보 다시 로드하여 참석자 현황 업데이트
      await loadMatchDetail();
    } catch (error) {
      console.error('투표 실패:', error);
      toast.error('투표에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setVoting(false);
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

  const getPositionInfo = (position: string) => {
    const positionData: { [key: string]: { label: string; icon: string; color: string } } = {
      'GK': { label: '골키퍼', icon: '⚽', color: 'bg-yellow-100 text-yellow-800' },
      'CB': { label: '센터백', icon: '🛡', color: 'bg-blue-100 text-blue-800' },
      'LB': { label: '풀백(왼쪽)', icon: '🛡', color: 'bg-blue-100 text-blue-800' },
      'RB': { label: '풀백(오른쪽)', icon: '🛡', color: 'bg-blue-100 text-blue-800' },
      'CDM': { label: '수비형 미드필더', icon: '🧠', color: 'bg-green-100 text-green-800' },
      'CM': { label: '중앙 미드필더', icon: '🧠', color: 'bg-green-100 text-green-800' },
      'CAM': { label: '공격형 미드필더', icon: '🧠', color: 'bg-green-100 text-green-800' },
      'LW': { label: '윙어(왼쪽)', icon: '🚀', color: 'bg-red-100 text-red-800' },
      'RW': { label: '윙어(오른쪽)', icon: '🚀', color: 'bg-red-100 text-red-800' },
      'CF': { label: '센터 포워드', icon: '🚀', color: 'bg-red-100 text-red-800' },
    };
    return positionData[position] || { label: position, icon: '⚪', color: 'bg-gray-100 text-gray-800' };
  };

  const getAttendanceStats = () => {
    if (!match?.attendances) return { attending: 0, notAttending: 0, total: 0 };
    
    const attending = match.attendances.filter(a => a.status === 'attending').length;
    const notAttending = match.attendances.filter(a => a.status === 'not_attending').length;
    const total = match.attendances.length;
    
    return { attending, notAttending, total };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="text-gray-400 text-6xl mb-4">😔</div>
        <h2 className="text-xl font-semibold text-gray-600 mb-2">경기를 찾을 수 없습니다</h2>
        <Link to="/matches" className="text-blue-600 hover:text-blue-700">
          경기 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const stats = getAttendanceStats();
  const upcoming = isUpcoming(match.match_date);
  const attendingUsers = match.attendances?.filter(a => a.status === 'attending') || [];
  const notAttendingUsers = match.attendances?.filter(a => a.status === 'not_attending') || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
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

      {/* 경기 정보 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{match.title}</h1>
              {upcoming && (
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  예정
                </span>
              )}
              {!upcoming && (
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                  종료
                </span>
              )}
            </div>
          </div>
          
          {(user?.is_admin || user?.id === match.creator_id) && (
            <div className="flex space-x-2">
              <Link
                to={`/matches/${match.id}/edit`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                수정
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-xl">📅</span>
              <div>
                <div className="font-medium text-gray-800">
                  {formatDate(match.match_date)}
                </div>
                <div className="text-gray-600">
                  {formatTime(match.match_time)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xl">📍</span>
              <div className="text-gray-800">{match.location}</div>
            </div>

            {match.creator && (
              <div className="flex items-center space-x-3">
                <span className="text-xl">👤</span>
                <div className="text-gray-800">주최: {match.creator.name}</div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-3">참석 현황</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700">🟢 참석</span>
                <span className="font-medium text-blue-800">{stats.attending}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">🔴 불참</span>
                <span className="font-medium text-blue-800">{stats.notAttending}명</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-2">
                <span className="text-blue-700 font-medium">총 투표</span>
                <span className="font-bold text-blue-800">{stats.total}명</span>
              </div>
            </div>
          </div>
        </div>

        {match.description && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">경기 설명</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{match.description}</p>
          </div>
        )}
      </div>

      {/* 참석 투표 */}
      {user && upcoming && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">참석 투표</h2>
          
          {myVote && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                현재 투표: <span className="font-medium">
                  {myVote === 'attending' ? '🟢 참석' : '🔴 불참'}
                </span>
                {' '} (다시 클릭하여 변경 가능)
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleVote('attending')}
              disabled={voting}
              className={`p-4 rounded-lg border-2 transition-colors ${
                myVote === 'attending'
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-2xl mb-2">🟢</div>
              <div className="font-medium">참석하기</div>
              <div className="text-sm text-gray-600 mt-1">경기에 참여합니다</div>
            </button>

            <button
              onClick={() => handleVote('not_attending')}
              disabled={voting}
              className={`p-4 rounded-lg border-2 transition-colors ${
                myVote === 'not_attending'
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-2xl mb-2">🔴</div>
              <div className="font-medium">불참</div>
              <div className="text-sm text-gray-600 mt-1">참여하지 않습니다</div>
            </button>
          </div>
        </div>
      )}

      {!user && upcoming && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            참석 투표를 하려면 <Link to="/login" className="font-medium underline">로그인</Link>이 필요합니다.
          </p>
        </div>
      )}

      {/* 참석자 목록 */}
      {stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 참석자 */}
          {attendingUsers.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                🟢 참석자 ({attendingUsers.length}명)
              </h3>
              <div className="space-y-3">
                {attendingUsers.map((attendance) => (
                  <div key={attendance.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">
                          {attendance.user?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">
                        {attendance.user?.name || '알 수 없음'}
                      </span>
                    </div>
                    {attendance.user?.position_main && (
                      <span className={`text-xs px-2 py-1 rounded ${getPositionInfo(attendance.user.position_main).color}`}>
                        {getPositionInfo(attendance.user.position_main).icon} {getPositionInfo(attendance.user.position_main).label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 불참자 */}
          {notAttendingUsers.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                🔴 불참자 ({notAttendingUsers.length}명)
              </h3>
              <div className="space-y-3">
                {notAttendingUsers.map((attendance) => (
                  <div key={attendance.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-bold text-sm">
                          {attendance.user?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">
                        {attendance.user?.name || '알 수 없음'}
                      </span>
                    </div>
                    {attendance.user?.position_main && (
                      <span className={`text-xs px-2 py-1 rounded ${getPositionInfo(attendance.user.position_main).color}`}>
                        {getPositionInfo(attendance.user.position_main).icon} {getPositionInfo(attendance.user.position_main).label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchDetailPage; 