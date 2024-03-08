import { Cache } from 'cache-manager';
import * as dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMemberDto, UpdateMemberDto } from '@members/dto';
import { Member } from '@members/entities';
import { JwtPayloadDto, OAuthTokenDto, ProfileDto } from '../dto';
import { CacheKey } from '../interface/cache-key';

dotenv.config();

@Injectable()
export class AuthService {
  clientId: string;

  redirectUri: string;

  clientSecret: string;

  ttl: number;

  constructor(
    readonly jwtService: JwtService,
    @InjectRepository(Member)
    readonly membersRepository: Repository<Member>,
    @Inject(CACHE_MANAGER)
    readonly cacheManager: Cache,
  ) {}

  init(provider: string) {
    this.clientId = process.env[`${provider}_CLIENT_ID`] ?? '';
    this.redirectUri = process.env[`${provider}_REDIRECT_URI`] ?? '';
    this.clientSecret = process.env[`${provider}_CLIENT_SECRET`] ?? '';
    this.ttl = parseInt(process.env.TTL ?? '0');
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
    await this.createMember(createMemberDto);
    return this.authenticate(providerId, profile, token);
  }

  async login(
    id: string,
    providerId: number,
    profile: ProfileDto,
    token: OAuthTokenDto,
  ): Promise<string> {
    await this.updateMember(
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

  private async createMember(
    createMemberDto: CreateMemberDto,
  ): Promise<Member> {
    try {
      const member: Member = Member.fromDto(createMemberDto);
      return await this.membersRepository.save(member);
    } catch (err: unknown) {
      throw err;
    }
  }

  async findMemberByEmail(
    email: string,
    providerId: number,
  ): Promise<Member | null> {
    try {
      return await this.membersRepository.findOne({
        where: { email, providerId },
        select: ['id'],
      });
    } catch (err: unknown) {
      throw err;
    }
  }

  private async updateMember(
    id: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<boolean> {
    try {
      await this.membersRepository.update({ id: id }, updateMemberDto);
      return true;
    } catch (err: unknown) {
      throw err;
    }
  }
}
