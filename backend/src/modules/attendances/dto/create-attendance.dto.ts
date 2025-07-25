import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsUUID } from 'class-validator';

export class CreateAttendanceDto {
  @ApiProperty({ 
    description: '경기 ID', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @IsUUID()
  match_id: string;

  @ApiProperty({ 
    description: '참석 상태', 
    example: 'attending',
    enum: ['attending', 'not_attending']
  })
  @IsString()
  @IsIn(['attending', 'not_attending'])
  status: 'attending' | 'not_attending';
} 