import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigurationKeyPaths } from 'src/config';

export function setupSwagger(app: INestApplication): void {
  const configService: ConfigService<ConfigurationKeyPaths> = app.get(ConfigService);

  // 默认为启用
  const enable = configService.get<boolean>('swagger.enable', true);
  if (!enable) {
    return;
  }

  const options = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title'))
    .setDescription(configService.get<string>('swagger.desc'))
    .setVersion('1.0')
    .addTag('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(configService.get<string>('swagger.path', '/doc'), app, document);
}
