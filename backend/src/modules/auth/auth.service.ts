import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateKakaoUser(kakaoProfile: any): Promise<any> {
    const { id, username, _json } = kakaoProfile;
    const kakaoId = `kakao_${id}`;
    
    // 기존 사용자 확인
    let user = await this.usersService.findByKakaoId(kakaoId);
    
    if (!user) {
      // 새 사용자 생성
      const createUserDto: CreateUserDto = {
        id: kakaoId,
        name: _json.properties?.nickname || username || '사용자',
        position_main: 'MF', // 기본값
        position_sub: [],
        level: 3, // 기본 레벨
        is_admin: false,
        profile_image: _json.properties?.profile_image || _json.properties?.thumbnail_image || '', // 카카오 프로필 이미지
      };
      
      user = await this.usersService.create(createUserDto);
    } else {
      // 기존 사용자의 프로필 이미지 업데이트 (최신 이미지로 동기화)
      const newProfileImage = _json.properties?.profile_image || _json.properties?.thumbnail_image || '';
      if (newProfileImage && user.profile_image !== newProfileImage) {
        user = await this.usersService.update(user.id, { 
          profile_image: newProfileImage 
        });
      }
    }
    
    return user;
  }

  async login(user: any) {
    const payload = { 
      sub: user.id, 
      name: user.name,
      is_admin: user.is_admin 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        position_main: user.position_main,
        position_sub: user.position_sub,
        level: user.level,
        is_admin: user.is_admin,
        profile_image: user.profile_image,
      },
    };
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.usersService.findByKakaoId(payload.sub);
    return user;
  }
} 