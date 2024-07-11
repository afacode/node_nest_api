import { Body, Controller, Headers, Get, Post, Req, Query, Sse } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ADMIN_PREFIX } from '../admin.constants';
import { LoginService } from './login.service';
import { Authorize } from '../adminCore/decorators/authorize.decorator';
import { LogDisabled } from '../adminCore/decorators/log-disabled.decorator';
import { ImageCaptchaDto, LoginInfoDto, LoginToken } from './login.dto';
import { UtilService } from '@/shared/services/util.service';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { exec } from 'node:child_process';
@ApiTags('登录模块')
@Controller()
export class LoginController {
  constructor(
    private loginService: LoginService,
    private util: UtilService,
  ) {}

  @ApiOperation({ summary: '获取登录图片验证码' })
  @Get('captcha/img')
  @Authorize()
  async captchaByImg(@Query() dto: ImageCaptchaDto) {
    return await this.loginService.createImageCaptcha(dto);
  }

  @ApiOperation({
    summary: '管理员登录',
  })
  @Post('login')
  @LogDisabled()
  @Authorize()
  async login(
    @Body() dto: LoginInfoDto,
    @Req() req: Request,
    @Headers('user-agent') ua: string,
  ): Promise<LoginToken> {
    await this.loginService.checkImgCaptcha(dto.captchaId, dto.verifyCode);
    const { token, refresh_token } = await this.loginService.getLoginSign(
      dto.username,
      dto.password,
      this.util.getReqIP(req),
      ua,
    );
    return { token, refresh_token };
  }

  @ApiOperation({
    summary: 'token刷新',
  })
  @Get('refresh')
  @LogDisabled()
  @Authorize()
  async refresh(@Query('refresh_token') refresh: string) {
    const dto = await this.loginService.getUserByUid(refresh);

    // const { token, refresh_token } = await this.loginService.getToken(dto);
    return { token: 'test', refresh_token: 'test' };
  }

  @ApiOperation({ summary: 'redis test' })
  @Get('redis')
  @Authorize()
  async test() {
    return await this.loginService.redisTest();
  }

  @ApiOperation({ summary: 'Server Sent Event' })
  @Sse('sse')
  @Authorize()
  stream() {
    // 只要 http 返回 Content-Type 为 text/event-stream 的 header
	// 前端使用 EventSource 的 onmessage 来接收消息。
	// const childProcess = exec('tail -f ./log');

    // return new Observable((observer) => {
    //   childProcess.stdout.on('data', (msg) => {
    //     observer.next({ data: { msg: msg.toString() } });
    //   });
    // });
    return new Observable((observer) => {
      observer.next({ data: { msg: 'aaa'} });

      setTimeout(() => {
    	observer.next({ data: { msg: 'bbb'} });
      }, 2000);

      setTimeout(() => {
    	observer.next({ data: { msg: 'ccc'} });
      }, 5000);
    });
  }
}
