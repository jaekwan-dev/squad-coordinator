import axios from 'axios';

export interface Match {
  id: string;
  title: string;
  match_date: string;
  match_time: string;
  location: string;
  description?: string;
  creator_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  creator?: {
    id: string;
    name: string;
  };
  attendances?: Attendance[];
  attendance_count?: any[];
}

export interface Attendance {
  id: string;
  match_id: string;
  user_id: string;
  status: 'attending' | 'not_attending';
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    position_main?: string;
    position_sub?: string[];
  };
  match?: Match;
}

export interface AttendanceStats {
  total: number;
  attending: number;
  not_attending: number;
}

export interface CreateMatchRequest {
  title: string;
  match_date: string;
  match_time: string;
  location: string;
  description?: string;
}

export interface UpdateMatchRequest {
  title?: string;
  match_date?: string;
  match_time?: string;
  location?: string;
  description?: string;
  is_active?: boolean;
}

class MatchService {
  private baseURL = '/matches';

  // 경기 목록 조회
  async getMatches(limit?: number): Promise<Match[]> {
    const params = limit ? { limit } : {};
    const response = await axios.get(this.baseURL, { params });
    return response.data;
  }

  // 다가오는 경기 조회
  async getUpcomingMatches(limit: number = 1): Promise<Match[]> {
    const response = await axios.get(`${this.baseURL}/upcoming`, {
      params: { limit }
    });
    return response.data;
  }

  // 특정 경기 조회
  async getMatch(id: string): Promise<Match> {
    const response = await axios.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  // 경기 생성 (관리자만)
  async createMatch(matchData: CreateMatchRequest): Promise<Match> {
    const response = await axios.post(this.baseURL, matchData);
    return response.data;
  }

  // 경기 수정
  async updateMatch(id: string, matchData: UpdateMatchRequest): Promise<Match> {
    const response = await axios.patch(`${this.baseURL}/${id}`, matchData);
    return response.data;
  }

  // 경기 삭제
  async deleteMatch(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`${this.baseURL}/${id}`);
    return response.data;
  }
}

export const matchService = new MatchService(); 