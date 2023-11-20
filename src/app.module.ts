import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { UploadModule } from './plugins/upload/upload.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountModule } from './api/account/account.module';
import { LoginModule } from './api/login/login.module';
import { RedisModule } from './plugins/redis/redis.module';
import {ConfigurationKeyPaths, getConfiguration} from './config'
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoginGuard } from './guard/login.guard';
import { PermissionGuard } from './guard/permission.guard';
import * as winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');
import { WinstonModule, utilities } from 'nest-winston';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ResponseInterceptor } from './common/response.interceptor';
import { HttpFilter } from './common/http.filter';
import { WsModule } from './ws/ws.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from './plugins/core/core.module';
import { ApiTransformInterceptor } from './common/interceptors/api-transform.interceptor';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { AdminModule } from './modules/admin/admin.module';

// docker run -e MYSQL_ROOT_PASSWORD=123456 -p 330603306 -d mysql:8

// 在线MySQL db4free.net's MySQL 8.2数据库的权限。 访问域名为：db4free.net 端口为：3306
// 数据库: afacode_tes
// 用户名: afacode_tes
/**
 * 在线Redis 7.2.0
 * Database name afacode-free-db
 * Public endpoint redis-11726.c299.asia-northeast1-1.gce.cloud.redislabs.com:11726
 * Username: "default"
 * password: fCTjrdsKCXcUKgTdrzIFJBz5qka7ItnI
 */
@Module({
  imports: [
    // 多个env文件谁先加载使用那个
    ConfigModule.forRoot({
      envFilePath: [ '.env.development' ],
      isGlobal: true,
      load: [ getConfiguration ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory(configService: ConfigService<ConfigurationKeyPaths>) {
        return {
          autoLoadEntities: true,
          type: configService.get<any>('mysql.type'),
          host: configService.get<string>('mysql.host'),
          port: configService.get<number>('mysql.port'),
          username: configService.get<string>('mysql.username'),
          password: configService.get<string>('mysql.password'),
          database: configService.get<string>('mysql.database'),
          synchronize: configService.get<boolean>('mysql.synchronize'),
          logging: configService.get('mysql.logging'),
          retryAttempts: 10, //	尝试连接数据库的次数（默认值：10）
          retryDelay: 800, //	连接重试之间的延迟（毫秒）（默认值：3000）
          entities: [ __dirname + '/**/*.entity{.ts, .js}' ],
        }
      },
      inject: [ ConfigService ],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwtSecret'),
          signOptions: {
            expiresIn: '1d', // 30 min
          },
        };
      },
      inject: [ ConfigService ],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike(),
          ),
          // silent: process.env.NODE_ENV === 'production'
        }),
        new DailyRotateFile({
          dirname: `logs`, // 日志保存的目录
          filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
          zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
          maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
          maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
          // 记录时添加时间戳信息
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.json(),
          ),
        }),
      ],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    UploadModule,
    AccountModule,
    LoginModule,
    RedisModule,
    WsModule,
    CoreModule,
    AdminModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: LoginGuard, //  全局启用身份验证 配合白名单
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: PermissionGuard, //  全局启用身份验证 配合白名单
    // },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter, // HttpFilter, //全局 API 异常拦截器
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiTransformInterceptor, // ResponseInterceptor, // 全局API 响应拦截器
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 全局logger
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
