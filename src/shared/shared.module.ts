import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UtilService } from './services/util.service';

const providers = [UtilService]
/**
 * 全局共享模块
 */
@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    // redis cache
    // CacheModule.register(),
    // jwt
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          // secret: configService.get<string>('jwt.secret'),
          secret: configService.get('jwtSecret'),
          signOptions: {
            expiresIn: '1d', // 30 min
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [...providers],
  exports: [HttpModule, JwtModule, ...providers],
})
export class SharedModule {}
