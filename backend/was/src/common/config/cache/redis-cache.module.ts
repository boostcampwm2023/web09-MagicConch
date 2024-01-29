import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import * as dotenv from 'dotenv';

dotenv.config();

@Global()
@Module({})
export class RedisCacheModule {
  static register(): DynamicModule {
    return {
      module: RedisCacheModule,
      imports: [
        CacheModule.registerAsync({
          useFactory: () => {
            return {
              config: {
                store: redisStore,
                host: process.env.CACHE_HOST,
                port: parseInt(process.env.CACHE_PORT ?? '6379'),
              },
            };
          },
        }),
      ],
      exports: [CacheModule],
    };
  }
}
