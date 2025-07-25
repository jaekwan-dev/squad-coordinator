import axios from 'axios';
import { Attendance, AttendanceStats } from './matchService';

export interface VoteRequest {
  match_id: string;
  status: 'attending' | 'not_attending';
}

export interface UpdateVoteRequest {
  status: 'attending' | 'not_attending';
}

class AttendanceService {
  private baseURL = '/attendances';

  // 참석 투표
  async vote(voteData: VoteRequest): Promise<Attendance> {
    const response = await axios.post(`${this.baseURL}/vote`, voteData);
    return response.data;
  }

  // 투표 수정
  async updateVote(matchId: string, voteData: UpdateVoteRequest): Promise<Attendance> {
    const response = await axios.patch(`${this.baseURL}/${matchId}`, voteData);
    return response.data;
  }

  // 특정 경기의 모든 참석 현황 조회
  async getAttendanceByMatch(matchId: string): Promise<Attendance[]> {
    const response = await axios.get(`${this.baseURL}/match/${matchId}`);
    return response.data;
  }

  // 특정 경기에 대한 내 투표 조회
  async getMyVote(matchId: string): Promise<Attendance | null> {
    try {
      const response = await axios.get(`${this.baseURL}/match/${matchId}/my-vote`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // 아직 투표하지 않음
      }
      throw error;
    }
  }

  // 특정 경기의 참석 통계 조회
  async getAttendanceStats(matchId: string): Promise<AttendanceStats> {
    const response = await axios.get(`${this.baseURL}/match/${matchId}/stats`);
    return response.data;
  }
}

export const attendanceService = new AttendanceService(); 