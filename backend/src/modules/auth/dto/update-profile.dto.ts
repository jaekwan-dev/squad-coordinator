import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsIn, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ 
    description: '주 포지션', 
    example: 'MF',
    enum: ['GK', 'DF', 'MF', 'FW']
  })
  @IsOptional()
  @IsString()
  @IsIn(['GK', 'DF', 'MF', 'FW'])
  position_main?: string;

  @ApiProperty({ 
    description: '부 포지션 배열', 
    example: ['FW', 'DF'],
    isArray: true,
    enum: ['GK', 'DF', 'MF', 'FW']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  position_sub?: string[];
} 