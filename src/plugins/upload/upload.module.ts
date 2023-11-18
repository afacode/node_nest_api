import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, parse } from 'path';

@Module({
  imports: [
    MulterModule.register({
      // 指定文件存储目录
      storage: diskStorage({
        destination: join(process.cwd(), './files'),
        // 通过时间戳来重命名上传的文件名
        filename: (req, file: Express.Multer.File, callback) => {
          const fileName = `${parse(file.originalname).name}-${new Date().getTime() + extname(file.originalname)}`;
          return callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
