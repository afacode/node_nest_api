import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

// docker run --name redis -d -p 6379:6379 redis:6.0
@Global()
@Module({
  providers: [
    RedisService, 
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: '127.0.0.1',
            port: 6379
          },
          database: 1
        })
        await client.connect()
        return client
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
