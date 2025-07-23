import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async create(createUserDto: CreateUserDto) {
    const { data, error } = await this.supabase
      .from('users')
      .insert(createUserDto)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
  }

  async findByKakaoId(kakaoId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', kakaoId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { data, error } = await this.supabase
      .from('users')
      .update(updateUserDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    return { message: 'User deleted successfully' };
  }

  async setAdmin(id: string, isAdmin: boolean) {
    return this.update(id, { is_admin: isAdmin });
  }
} 