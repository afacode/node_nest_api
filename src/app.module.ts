import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ListModule } from './list/list.module';
import { ConfigModule } from './config/config.moudle';
import { UploadModule } from './upload/upload.module';
import { GuardModule } from './guard/guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoModule } from './demo/demo.module';

// docker run -e MYSQL_ROOT_PASSWORD=123456 -p 330603306 -d mysql:8
@Module({
  imports: [
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
    UserModule, ListModule, ConfigModule, UploadModule, GuardModule, DemoModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
