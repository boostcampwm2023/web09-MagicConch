import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { CreateMemberDto } from 'src/members/dto/create-member.dto';
import { UpdateMemberDto } from 'src/members/dto/update-member.dto';
import { Member } from 'src/members/entities/member.entity';
import { MembersService } from 'src/members/members.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { OAuthTokenDto } from '../dto/oauth-token.dto';
import { ProfileDto } from '../dto/profile.dto';
import { CacheKey } from '../interface/cache-key';

@Injectable()
export class AuthService {
  clientId: string;
  redirectUri: string;
  clientSecret: string;
  ttl: number;

  constructor(
    @InjectRepository(Member)
    readonly membersService: MembersService,
    readonly jwtService: JwtService,
    readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    readonly cacheManager: Cache,
  ) {}

  init(provider: string) {
    this.clientId = this.configService.get(`${provider}_CLIENT_ID`) ?? '';
    this.redirectUri = this.configService.get(`${provider}_REDIRECT_URI`) ?? '';
    this.clientSecret =
      this.configService.get(`${provider}_CLIENT_SECRET`) ?? '';
    this.ttl = this.configService.get<number>('TTL') ?? 0;
  }

  async signup(
    providerId: number,
    profile: ProfileDto,
    token: OAuthTokenDto,
  ): Promise<string> {
    const createMemberDto: CreateMemberDto = CreateMemberDto.fromProfile(
      providerId,
      profile,
    );
    await this.membersService.create(createMemberDto);
    return this.authenticate(providerId, profile, token);
  }

  async login(
    id: string,
    providerId: number,
    profile: ProfileDto,
    token: OAuthTokenDto,
  ): Promise<string> {
    await this.membersService.update(
      id,
      UpdateMemberDto.fromProfile(providerId, profile),
    );
    return this.authenticate(providerId, profile, token);
  }

  private authenticate(
    providerId: number,
    profile: ProfileDto,
    token: OAuthTokenDto,
  ): string {
    const key: CacheKey = { email: profile.email, providerId: providerId };
    this.cacheManager.set(JSON.stringify(key), token.refresh_token, this.ttl);
    return this.makeToken(profile.email, providerId, token.access_token);
  }

  private makeToken(
    email: string,
    providerId: number,
    accessToken: string,
  ): string {
    const payload: JwtPayloadDto = JwtPayloadDto.fromInfo(
      email,
      providerId,
      accessToken,
    );
    return this.signPayload(payload);
  }

  private signPayload(payload: JwtPayloadDto): string {
    return this.jwtService.sign(payload);
  }
}
