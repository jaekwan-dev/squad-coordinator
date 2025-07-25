import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@ApiTags('Matches')
@Controller('matches')
@ApiBearerAuth()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '경기 생성 (관리자만 가능)' })
  @ApiResponse({ status: 201, description: '경기 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '권한 없음 (관리자만 가능)' })
  async create(@Req() req, @Body() createMatchDto: CreateMatchDto) {
    // 관리자 권한 확인
    if (!req.user.is_admin) {
      throw new Error('관리자만 경기를 생성할 수 있습니다.');
    }
    
    return this.matchesService.create(createMatchDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: '경기 목록 조회' })
  @ApiQuery({ name: 'limit', required: false, description: '조회할 경기 수' })
  @ApiResponse({ status: 200, description: '경기 목록 조회 성공' })
  async findAll(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.matchesService.findAll(limit);
  }

  @Get('upcoming')
  @ApiOperation({ summary: '다가오는 경기 조회' })
  @ApiQuery({ name: 'limit', required: false, description: '조회할 경기 수 (기본값: 1)' })
  @ApiResponse({ status: 200, description: '다가오는 경기 조회 성공' })
  async findUpcoming(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.matchesService.findUpcoming(limit || 1);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 경기 상세 조회' })
  @ApiResponse({ status: 200, description: '경기 상세 조회 성공' })
  @ApiResponse({ status: 404, description: '경기를 찾을 수 없음' })
  async findOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '경기 정보 수정 (생성자 또는 관리자만 가능)' })
  @ApiResponse({ status: 200, description: '경기 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiResponse({ status: 404, description: '경기를 찾을 수 없음' })
  async update(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
    @Req() req,
  ) {
    return this.matchesService.update(id, updateMatchDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '경기 삭제 (생성자 또는 관리자만 가능)' })
  @ApiResponse({ status: 200, description: '경기 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiResponse({ status: 404, description: '경기를 찾을 수 없음' })
  async remove(@Param('id') id: string, @Req() req) {
    return this.matchesService.remove(id, req.user.id);
  }
} 