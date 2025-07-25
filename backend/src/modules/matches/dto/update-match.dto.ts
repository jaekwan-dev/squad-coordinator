import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateMatchDto {
  @ApiProperty({ 
    description: '경기 제목', 
    example: '토요일 정기전',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    description: '경기 날짜 (YYYY-MM-DD)', 
    example: '2024-01-15',
    required: false
  })
  @IsOptional()
  @IsDateString()
  match_date?: string;

  @ApiProperty({ 
    description: '경기 시간 (HH:MM)', 
    example: '14:00',
    required: false
  })
  @IsOptional()
  @IsString()
  match_time?: string;

  @ApiProperty({ 
    description: '경기 장소', 
    example: '서울월드컵경기장 보조구장',
    required: false
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ 
    description: '경기 설명',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: '경기 활성화 상태',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
} 