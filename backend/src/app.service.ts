import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '⚽ SoccerSquad Backend API is running!';
  }
} 