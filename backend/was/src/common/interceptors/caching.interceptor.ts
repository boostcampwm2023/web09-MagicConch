import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { Observable, lastValueFrom, of } from 'rxjs';

const resultRegExp: RegExp =
  /^\/tarot\/result\/[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}/;

@Injectable()
export class CachingInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER)
    cacheManager: Cache,
    readonly reflector: Reflector,
  ) {
    super(cacheManager, reflector);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();
    const isGetRequest = req.method === 'GET';
    const cacheKey = isGetRequest ? req.url : undefined;

    if (!cacheKey) {
      return next.handle();
    }

    const cachedValue: any = await this.cacheManager.get(cacheKey);
    if (cachedValue) {
      return of(cachedValue);
    }

    const res: any = await lastValueFrom(next.handle());
    const ttl: number = resultRegExp.test(req.url) ? 3600 : 60;
    await this.cacheManager.set(cacheKey, res, ttl);
    return of(res);
  }
}
