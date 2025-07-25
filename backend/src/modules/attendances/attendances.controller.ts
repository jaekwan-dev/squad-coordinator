import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@ApiTags('Attendances')
@Controller('attendances')
@ApiBearerAuth()
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post('vote')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '경기 참석 투표' })
  @ApiResponse({ status: 201, description: '투표 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '경기를 찾을 수 없음' })
  async vote(@Req() req, @Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.vote(createAttendanceDto, req.user.id);
  }

  @Patch(':matchId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '경기 참석 투표 수정' })
  @ApiResponse({ status: 200, description: '투표 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '기존 투표를 찾을 수 없음' })
  async updateVote(
    @Param('matchId') matchId: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @Req() req,
  ) {
    return this.attendancesService.updateVote(matchId, updateAttendanceDto, req.user.id);
  }

  @Get('match/:matchId')
  @ApiOperation({ summary: '특정 경기의 모든 참석 현황 조회' })
  @ApiResponse({ status: 200, description: '참석 현황 조회 성공' })
  async getAttendanceByMatch(@Param('matchId') matchId: string) {
    return this.attendancesService.getAttendanceByMatch(matchId);
  }

  @Get('match/:matchId/my-vote')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '특정 경기에 대한 내 투표 조회' })
  @ApiResponse({ status: 200, description: '내 투표 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async getMyVote(@Param('matchId') matchId: string, @Req() req) {
    return this.attendancesService.getMyVote(matchId, req.user.id);
  }

  @Get('match/:matchId/stats')
  @ApiOperation({ summary: '특정 경기의 참석 통계 조회' })
  @ApiResponse({ status: 200, description: '참석 통계 조회 성공' })
  async getAttendanceStats(@Param('matchId') matchId: string) {
    return this.attendancesService.getAttendanceStats(matchId);
  }
} 