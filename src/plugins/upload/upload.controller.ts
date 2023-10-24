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
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { zip } from 'compressing';
import { join } from 'path';
import type { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('upload组')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('images')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    console.log(file);
    return { message: 'upload  images success' };
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

  @Get()
  findAll() {
    return { message: 'upload  get' };
  }
}
