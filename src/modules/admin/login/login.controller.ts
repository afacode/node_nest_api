import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ADMIN_PREFIX } from '../admin.constants';
import { LoginService } from './login.service';
import { Authorize } from '../adminCore/decorators/authorize.decorator';

@ApiTags('登录模块')
@Controller()
export class LoginController {
    constructor(private loginService: LoginService) {}
    
  @ApiOperation({ summary: '获取登录图片验证码' })
  @Get('captcha/img')
  @Authorize()
  async captchaByImg() {
    return { name: '获取登录图片验证码' };
  }
}
