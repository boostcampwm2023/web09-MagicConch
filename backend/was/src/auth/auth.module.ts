import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities';
import { AuthController } from './auth.controller';
import { JwtAuthGuard, SocketJwtAuthGuard } from './guard';
import { AuthService, KakaoAuthService } from './service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([Member])],
  controllers: [AuthController],
  providers: [
    AuthService,
    KakaoAuthService,
    JwtStrategy,
    JwtAuthGuard,
    SocketJwtAuthGuard,
  ],
  exports: [PassportModule, JwtAuthGuard, SocketJwtAuthGuard],
})
export class AuthModule {}
