import { Body, Controller, Headers, Get, Post, Req, Query, Redirect, Param, BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ShortUrlService } from './shortUrl.service';
import { Authorize } from '@/modules/admin/adminCore/decorators/authorize.decorator';

@ApiTags('短链接')
@Controller('url')
export class ShortUrlController {
    constructor(private shortUrlService: ShortUrlService, ) {}
    
  @ApiOperation({ summary: '短连接访问' })
  @Get(':code')
  // @Redirect()
  @Authorize()
  async jump(@Param('code') code: string) {
    const longUrl = await this.shortUrlService.getLongUrl(code);
    if(!longUrl) {
        throw new BadRequestException('短链不存在');
      }
      return {
        url: longUrl,
        statusCode: 302
      } 
  }

  @ApiOperation({
    summary: '链接转为短链',
  })
  @Get('short-url')
  @Authorize()
  async generateShortUrl(@Query('url') longUrl: string) {
    return await this.shortUrlService.generate(longUrl);
  }

@ApiOperation({
  summary: '生成code',
})
@Get('code')
@Authorize()
  async generateCode() {
    return this.shortUrlService.generateCode();
  }
}
