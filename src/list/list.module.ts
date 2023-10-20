import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { Log } from 'src/middleware/log.middleware';

@Module({
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Log).forRoutes('list')
  };
}
