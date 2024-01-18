import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Global()
@Module({})
export class RedisCacheModule {
  static register(): DynamicModule {
    return {
      module: RedisCacheModule,
      imports: [
        CacheModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              config: {
                store: redisStore,
                host: configService.get('CACHE_HOST'),
                port: configService.get<number>('CACHE_PORT'),
              },
            };
          },
        }),
      ],
      exports: [CacheModule],
    };
  }
}
