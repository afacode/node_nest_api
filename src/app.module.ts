import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { UploadModule } from './plugins/upload/upload.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountModule } from './api/account/account.module';
import { LoginModule } from './api/login/login.module';
import { RedisModule } from './plugins/redis/redis.module';
import configuration from './config';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoginGuard } from './guard/login.guard';
import { PermissionGuard } from './guard/permission.guard';
import * as winston from 'winston';
// import 'winston-daily-rotate-file';
import DailyRotateFile = require('winston-daily-rotate-file');
import { WinstonModule, utilities } from 'nest-winston';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ResponseInterceptor } from './common/response.interceptor';
import { HttpFilter } from './common/http.filter';
import { WsGateway } from './ws/ws.gateway';
import { GatewayModule } from './ws/gateway.module';

// docker run -e MYSQL_ROOT_PASSWORD=123456 -p 330603306 -d mysql:8
@Module({
  imports: [
    // 多个env文件谁先加载使用那个
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts, .js}'],
      synchronize: true,
      retryAttempts: 10, //	尝试连接数据库的次数（默认值：10）
      retryDelay: 800, //	连接重试之间的延迟（毫秒）（默认值：3000）
      autoLoadEntities: true, //	如果是 true，将自动加载实体（默认值：false）
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
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      transports: [
        // new winston.transports.Console({
        //   format: winston.format.printf(info => `[app] ${info.level}: ${info.message}`),
        //   silent: process.env.NODE_ENV === 'production'
        // }),
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
    UserModule,
    UploadModule,
    AccountModule,
    LoginModule,
    RedisModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: LoginGuard, //  全局启用身份验证 配合白名单
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard, //  全局启用身份验证 配合白名单
    },
    {
      provide: APP_FILTER,
      useClass: HttpFilter, //全局异常拦截器
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor, //全局响应拦截器
    },
    // WsGateway
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 全局logger
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
