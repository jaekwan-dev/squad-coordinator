import { Controller, Get, Post, Patch, UseGuards, Req, Res, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '카카오 로그인 시작' })
  async kakaoLogin() {
    // 카카오 인증 페이지로 리다이렉트
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '카카오 로그인 콜백' })
  async kakaoCallback(@Req() req, @Res() res: Response) {
    const loginResult = await this.authService.login(req.user);
    
    // 프론트엔드로 토큰과 함께 리다이렉트
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const token = loginResult.access_token;
    
    // 토큰을 쿼리 파라미터로 전달하거나 쿠키에 설정
    res.redirect(`${frontendUrl}/auth/success?token=${token}`);
  }

  @Post('token/validate')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'JWT 토큰 검증' })
  @ApiResponse({ status: 200, description: '토큰이 유효함' })
  @ApiResponse({ status: 401, description: '토큰이 무효함' })
  async validateToken(@Req() req) {
    return {
      valid: true,
      user: req.user,
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '사용자 프로필 조회' })
  async getProfile(@Req() req) {
    return req.user;
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '사용자 프로필 수정 (포지션 정보)' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: '프로필 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.id;
    return this.authService.updateProfile(userId, updateProfileDto);
  }
} 