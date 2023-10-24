import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cors from 'cors'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const config = app.get(ConfigService)

  // 静态资源访问
  app.useStaticAssets(join(__dirname, 'files'), {
    prefix: '/public',
  })

  // 全局中间件
  app.use(cors())

  // 全局pipe validate
  app.useGlobalPipes(new ValidationPipe())

  // websocket
  // app.useWebSocketAdapter(new SocketIoAdapter(app, app.get(ConfigService)));

  const options = new DocumentBuilder()
    .setTitle('doc')
    .setDescription('doc description')
    .setVersion('1.0')
    .addTag('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('doc', app, document)

  const PORT = config.get<number>('SERVE_PORT', 3000)
  await app.listen(PORT, () => {
    console.log(`app listen port ${PORT}`, config)
  })
}
bootstrap()
