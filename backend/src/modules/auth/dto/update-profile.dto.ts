import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsIn, IsOptional } from 'class-validator';

const POSITIONS = [
  // 골키퍼
  'GK',
  
  // 수비수
  'CB', 'LB', 'RB',
  
  // 미드필더
  'CDM', 'CM', 'CAM',
  
  // 공격수
  'LW', 'RW', 'CF'
] as const;

export class UpdateProfileDto {
  @ApiProperty({ 
    description: '주 포지션', 
    example: 'CAM',
    enum: POSITIONS
  })
  @IsOptional()
  @IsString()
  @IsIn(POSITIONS)
  position_main?: string;

  @ApiProperty({ 
    description: '부 포지션 배열', 
    example: ['CDM', 'CF'],
    isArray: true,
    enum: POSITIONS
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  position_sub?: string[];
} 