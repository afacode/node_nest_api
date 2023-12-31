import { Body, Controller, Headers, Get, Post, Req, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ADMIN_PREFIX } from '../admin.constants';
import { LoginService } from './login.service';
import { Authorize } from '../adminCore/decorators/authorize.decorator';
import {LogDisabled} from '../adminCore/decorators/log-disabled.decorator'
import { ImageCaptchaDto, LoginInfoDto, LoginToken } from './login.dto';
import { UtilService } from '@/shared/services/util.service';
import {Request} from 'express';
@ApiTags('登录模块')
@Controller()
export class LoginController {
    constructor(private loginService: LoginService, private util: UtilService,) {}
    
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
    const token = await this.loginService.getLoginSign(
      dto.username,
      dto.password,
      this.util.getReqIP(req),
      ua,
    );
    return { token };
  }

  @ApiOperation({ summary: 'redis test' })
  @Get('redis')
  @Authorize()
  async test() {
    return await this.loginService.redisTest();
  }
}
