import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

@Global()
@Module({})
export class CacheConfigModule {
  static register(): DynamicModule {
    return {
      module: CacheConfigModule,
      imports: [
        CacheModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService): RedisClientOptions => {
            return {
              store: redisStore,
              host: configService.get('CACHE_HOST'),
              port: configService.get<number>('CACHE_PORT'),
            } as RedisClientOptions;
          },
        }),
      ],
      exports: [CacheModule],
    };
  }
}
