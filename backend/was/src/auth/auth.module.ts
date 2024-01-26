import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities';
import { MembersModule } from 'src/members/members.module';
import { MembersService } from 'src/members/members.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard, SocketJwtAuthGuard } from './guard';
import { AuthService } from './service/auth.service';
import { KakaoAuthService } from './service/kakao.auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([Member]), MembersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    KakaoAuthService,
    MembersService,
    JwtStrategy,
    JwtAuthGuard,
    SocketJwtAuthGuard,
  ],
  exports: [PassportModule, JwtAuthGuard, SocketJwtAuthGuard],
})
export class AuthModule {}
