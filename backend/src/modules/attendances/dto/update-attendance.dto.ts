import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class UpdateAttendanceDto {
  @ApiProperty({ 
    description: '참석 상태', 
    example: 'not_attending',
    enum: ['attending', 'not_attending']
  })
  @IsString()
  @IsIn(['attending', 'not_attending'])
  status: 'attending' | 'not_attending';
} 