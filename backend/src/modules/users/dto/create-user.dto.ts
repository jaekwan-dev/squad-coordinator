import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber, IsBoolean, IsIn, Min, Max, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '카카오 사용자 ID', example: 'kakao_123456' })
  @IsString()
  id: string;

  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: '주 포지션', 
    example: 'MF',
    enum: ['GK', 'DF', 'MF', 'FW']
  })
  @IsString()
  @IsIn(['GK', 'DF', 'MF', 'FW'])
  position_main: string;

  @ApiProperty({ 
    description: '부 포지션 배열', 
    example: ['FW', 'DF'],
    isArray: true,
    enum: ['GK', 'DF', 'MF', 'FW']
  })
  @IsArray()
  @IsString({ each: true })
  position_sub: string[];

  @ApiProperty({ 
    description: '실력 레벨 (1-5)', 
    example: 3,
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  level: number;

  @ApiProperty({ 
    description: '관리자 여부', 
    example: false,
    default: false
  })
  @IsBoolean()
  is_admin: boolean;

  @ApiProperty({ 
    description: '프로필 이미지 URL', 
    example: 'https://k.kakaocdn.net/dn/profile_image.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  profile_image?: string;
} 