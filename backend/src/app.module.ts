import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    // 향후 추가될 모듈들
    // MatchesModule,
    // TeamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 