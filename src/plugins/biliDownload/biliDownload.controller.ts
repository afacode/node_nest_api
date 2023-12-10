import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('bili模块')
@Controller()
export class BiliDownloadController {
    @ApiOperation({ summary: 'bili下载' })
    // @ApiOkResponse({ type: AccountInfo })
    // @PermissionOptional()
    @Get('download')
    async download(@Req() req: Request) {
      return 1
    }
}