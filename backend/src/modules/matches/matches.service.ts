import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchesService {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');
    
    console.log('🔍 [Matches Service] Initializing Supabase client');
    console.log('🔍 [Matches Service] Supabase URL:', supabaseUrl ? 'Set ✅' : 'Not set ❌');
    console.log('🔍 [Matches Service] Service Key:', supabaseServiceKey ? 'Set ✅' : 'Not set ❌');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async create(createMatchDto: CreateMatchDto, creatorId: string) {
    console.log('🔍 [Match Create] Creating match:', createMatchDto);
    console.log('🔍 [Match Create] Creator ID:', creatorId);

    try {
      const { data, error } = await this.supabase
        .from('matches')
        .insert([
          {
            ...createMatchDto,
            creator_id: creatorId,
          },
        ])
        .select(`
          *,
          creator:users!creator_id(id, name)
        `)
        .single();

      if (error) {
        console.error('❌ [Match Create] Supabase error:', error);
        throw error;
      }

      console.log('✅ [Match Create] Match created successfully:', data.id);
      return data;
    } catch (error) {
      console.error('❌ [Match Create] Failed to create match:', error);
      throw error;
    }
  }

  async findAll(limit?: number) {
    console.log('🔍 [Match FindAll] Fetching matches, limit:', limit);

    try {
      let query = this.supabase
        .from('matches')
        .select(`
          *,
          creator:users!creator_id(id, name),
          attendance_count:attendances(count)
        `)
        .eq('is_active', true)
        .order('match_date', { ascending: true })
        .order('match_time', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ [Match FindAll] Supabase error:', error);
        throw error;
      }

      console.log('✅ [Match FindAll] Found matches:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ [Match FindAll] Failed to fetch matches:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    console.log('🔍 [Match FindOne] Fetching match:', id);

    try {
      const { data, error } = await this.supabase
        .from('matches')
        .select(`
          *,
          creator:users!creator_id(id, name),
          attendances(
            id,
            status,
            created_at,
            user:users!user_id(id, name, position_main, position_sub)
          )
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('❌ [Match FindOne] Supabase error:', error);
        if (error.code === 'PGRST116') {
          throw new NotFoundException('Match not found');
        }
        throw error;
      }

      if (!data) {
        console.log('❌ [Match FindOne] Match not found:', id);
        throw new NotFoundException('Match not found');
      }

      console.log('✅ [Match FindOne] Match found:', data.id);
      return data;
    } catch (error) {
      console.error('❌ [Match FindOne] Failed to fetch match:', error);
      throw error;
    }
  }

  async findUpcoming(limit: number = 1) {
    console.log('🔍 [Match FindUpcoming] Fetching upcoming matches, limit:', limit);

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await this.supabase
        .from('matches')
        .select(`
          *,
          creator:users!creator_id(id, name),
          attendances(
            id,
            status,
            user:users!user_id(id, name)
          )
        `)
        .eq('is_active', true)
        .gte('match_date', today)
        .order('match_date', { ascending: true })
        .order('match_time', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('❌ [Match FindUpcoming] Supabase error:', error);
        throw error;
      }

      console.log('✅ [Match FindUpcoming] Found upcoming matches:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ [Match FindUpcoming] Failed to fetch upcoming matches:', error);
      throw error;
    }
  }

  async update(id: string, updateMatchDto: UpdateMatchDto, userId: string) {
    console.log('🔍 [Match Update] Updating match:', id);
    console.log('🔍 [Match Update] Update data:', updateMatchDto);
    console.log('🔍 [Match Update] User ID:', userId);

    try {
      // 먼저 경기가 존재하는지 확인
      const existingMatch = await this.findOne(id);
      
      // 경기 생성자인지 확인
      if (existingMatch.creator_id !== userId) {
        // 관리자인지 확인
        const { data: userData } = await this.supabase
          .from('users')
          .select('is_admin')
          .eq('id', userId)
          .single();

        if (!userData?.is_admin) {
          console.log('❌ [Match Update] User not authorized:', userId);
          throw new ForbiddenException('경기를 수정할 권한이 없습니다.');
        }
      }

      const { data, error } = await this.supabase
        .from('matches')
        .update(updateMatchDto)
        .eq('id', id)
        .select(`
          *,
          creator:users!creator_id(id, name)
        `)
        .single();

      if (error) {
        console.error('❌ [Match Update] Supabase error:', error);
        throw error;
      }

      console.log('✅ [Match Update] Match updated successfully:', data.id);
      return data;
    } catch (error) {
      console.error('❌ [Match Update] Failed to update match:', error);
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    console.log('🔍 [Match Remove] Removing match:', id);
    console.log('🔍 [Match Remove] User ID:', userId);

    try {
      // 먼저 경기가 존재하는지 확인
      const existingMatch = await this.findOne(id);
      
      // 경기 생성자인지 확인
      if (existingMatch.creator_id !== userId) {
        // 관리자인지 확인
        const { data: userData } = await this.supabase
          .from('users')
          .select('is_admin')
          .eq('id', userId)
          .single();

        if (!userData?.is_admin) {
          console.log('❌ [Match Remove] User not authorized:', userId);
          throw new ForbiddenException('경기를 삭제할 권한이 없습니다.');
        }
      }

      // 소프트 삭제 (is_active = false)
      const { error } = await this.supabase
        .from('matches')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('❌ [Match Remove] Supabase error:', error);
        throw error;
      }

      console.log('✅ [Match Remove] Match removed successfully:', id);
      return { message: '경기가 삭제되었습니다.' };
    } catch (error) {
      console.error('❌ [Match Remove] Failed to remove match:', error);
      throw error;
    }
  }
} 