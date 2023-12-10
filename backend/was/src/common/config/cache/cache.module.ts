import { CacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

const options: RedisClientOptions = {
  store: redisStore,
  host: 'localhost',
  port: 6379,
} as RedisClientOptions;

@Module({})
export class CacheConfigModule {
  static register(): DynamicModule {
    return {
      module: CacheConfigModule,
      imports: [CacheModule.register(options)],
      exports: [CacheModule],
    };
  }
}
