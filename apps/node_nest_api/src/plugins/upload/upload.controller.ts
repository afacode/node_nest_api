import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { zip } from 'compressing';
import { join } from 'path';
import type { Response } from 'express';
import { Express } from 'express'
import { ApiTags } from '@nestjs/swagger';
import { IsPublicUrl } from 'src/common/publicUrl.decorator';

@ApiTags('upload组')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 要上传单个文件
  @IsPublicUrl()
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadFile(file)
    return {url}
  }

  // 多文件上传
  @Post('files')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);

    return 'success'
  }

  @Get('download')
  download(@Res() res: Response) {
    const url = join(__dirname, '../files/1697776063925.png');
    res.download(url);
  }

  @Get('stream')
  async stream(@Res() res: Response) {
    const url = join(__dirname, '../files/1697776063925.png');
    const tarStream = new zip.Stream();
    await tarStream.addEntry(url);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=afacode`);

    tarStream.pipe(res);
  }
}
