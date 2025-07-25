import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({ 
    description: '경기 제목', 
    example: '토요일 정기전' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    description: '경기 날짜 (YYYY-MM-DD)', 
    example: '2024-01-15' 
  })
  @IsDateString()
  @IsNotEmpty()
  match_date: string;

  @ApiProperty({ 
    description: '경기 시간 (HH:MM)', 
    example: '14:00' 
  })
  @IsString()
  @IsNotEmpty()
  match_time: string;

  @ApiProperty({ 
    description: '경기 장소', 
    example: '서울월드컵경기장 보조구장' 
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ 
    description: '경기 설명', 
    example: '주말 정기 경기입니다. 많은 참여 부탁드립니다!',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
} 