import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendancesService {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('🔍 [Attendances Service] Initializing Supabase client');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async vote(createAttendanceDto: CreateAttendanceDto, userId: string) {
    console.log('🔍 [Attendance Vote] Voting for match:', createAttendanceDto);
    console.log('🔍 [Attendance Vote] User ID:', userId);

    try {
      // 먼저 경기가 존재하는지 확인
      const { data: matchData, error: matchError } = await this.supabase
        .from('matches')
        .select('id, title, match_date')
        .eq('id', createAttendanceDto.match_id)
        .eq('is_active', true)
        .single();

      if (matchError || !matchData) {
        console.error('❌ [Attendance Vote] Match not found:', createAttendanceDto.match_id);
        throw new NotFoundException('경기를 찾을 수 없습니다.');
      }

      // 경기 날짜가 지났는지 확인
      const today = new Date().toISOString().split('T')[0];
      if (matchData.match_date < today) {
        console.error('❌ [Attendance Vote] Match date has passed:', matchData.match_date);
        throw new BadRequestException('이미 지난 경기에는 투표할 수 없습니다.');
      }

      // 기존 투표가 있는지 확인 후 upsert
      const { data, error } = await this.supabase
        .from('attendances')
        .upsert([
          {
            match_id: createAttendanceDto.match_id,
            user_id: userId,
            status: createAttendanceDto.status,
          },
        ], {
          onConflict: 'match_id,user_id',
        })
        .select(`
          *,
          match:matches!match_id(id, title, match_date, match_time),
          user:users!user_id(id, name)
        `)
        .single();

      if (error) {
        console.error('❌ [Attendance Vote] Supabase error:', error);
        throw error;
      }

      console.log('✅ [Attendance Vote] Vote recorded successfully');
      return data;
    } catch (error) {
      console.error('❌ [Attendance Vote] Failed to record vote:', error);
      throw error;
    }
  }

  async updateVote(matchId: string, updateAttendanceDto: UpdateAttendanceDto, userId: string) {
    console.log('🔍 [Attendance Update] Updating vote for match:', matchId);
    console.log('🔍 [Attendance Update] User ID:', userId);
    console.log('🔍 [Attendance Update] Status:', updateAttendanceDto.status);

    try {
      // 기존 투표가 있는지 확인
      const { data: existingVote, error: findError } = await this.supabase
        .from('attendances')
        .select('id')
        .eq('match_id', matchId)
        .eq('user_id', userId)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        console.error('❌ [Attendance Update] Error finding existing vote:', findError);
        throw findError;
      }

      if (!existingVote) {
        console.error('❌ [Attendance Update] No existing vote found');
        throw new NotFoundException('기존 투표를 찾을 수 없습니다.');
      }

      const { data, error } = await this.supabase
        .from('attendances')
        .update({ status: updateAttendanceDto.status })
        .eq('match_id', matchId)
        .eq('user_id', userId)
        .select(`
          *,
          match:matches!match_id(id, title, match_date, match_time),
          user:users!user_id(id, name)
        `)
        .single();

      if (error) {
        console.error('❌ [Attendance Update] Supabase error:', error);
        throw error;
      }

      console.log('✅ [Attendance Update] Vote updated successfully');
      return data;
    } catch (error) {
      console.error('❌ [Attendance Update] Failed to update vote:', error);
      throw error;
    }
  }

  async getAttendanceByMatch(matchId: string) {
    console.log('🔍 [Attendance GetByMatch] Fetching attendance for match:', matchId);

    try {
      const { data, error } = await this.supabase
        .from('attendances')
        .select(`
          *,
          user:users!user_id(id, name, position_main, position_sub)
        `)
        .eq('match_id', matchId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [Attendance GetByMatch] Supabase error:', error);
        throw error;
      }

      console.log('✅ [Attendance GetByMatch] Found attendances:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ [Attendance GetByMatch] Failed to fetch attendance:', error);
      throw error;
    }
  }

  async getMyVote(matchId: string, userId: string) {
    console.log('🔍 [Attendance GetMyVote] Fetching user vote for match:', matchId);
    console.log('🔍 [Attendance GetMyVote] User ID:', userId);

    try {
      const { data, error } = await this.supabase
        .from('attendances')
        .select(`
          *,
          match:matches!match_id(id, title, match_date, match_time)
        `)
        .eq('match_id', matchId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [Attendance GetMyVote] Supabase error:', error);
        throw error;
      }

      if (!data) {
        console.log('✅ [Attendance GetMyVote] No vote found (not voted yet)');
        return null;
      }

      console.log('✅ [Attendance GetMyVote] Vote found:', data.status);
      return data;
    } catch (error) {
      console.error('❌ [Attendance GetMyVote] Failed to fetch vote:', error);
      throw error;
    }
  }

  async getAttendanceStats(matchId: string) {
    console.log('🔍 [Attendance Stats] Getting stats for match:', matchId);

    try {
      const { data, error } = await this.supabase
        .from('attendances')
        .select('status')
        .eq('match_id', matchId);

      if (error) {
        console.error('❌ [Attendance Stats] Supabase error:', error);
        throw error;
      }

      const stats = {
        total: data?.length || 0,
        attending: data?.filter(a => a.status === 'attending').length || 0,
        not_attending: data?.filter(a => a.status === 'not_attending').length || 0,
      };

      console.log('✅ [Attendance Stats] Stats calculated:', stats);
      return stats;
    } catch (error) {
      console.error('❌ [Attendance Stats] Failed to get stats:', error);
      throw error;
    }
  }
} 