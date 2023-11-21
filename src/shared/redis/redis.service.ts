import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async getAllKeys() {
    const ret = await this.redisClient.keys('*')
    return ret;
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async del(key: string) {
    return await this.redisClient.del(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
}
