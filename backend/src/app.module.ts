import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MatchesModule } from './modules/matches/matches.module';
import { AttendancesModule } from './modules/attendances/attendances.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    MatchesModule,
    AttendancesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 