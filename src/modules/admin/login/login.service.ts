import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';
import { ImageCaptchaDto } from './login.dto';
import * as svgCaptcha from 'svg-captcha';
import { ApiException } from '@/common/exceptions/api.exception';
import { SysUserService } from '../system/user/user.service';
import SysUser from '@/entities/admin/sys_user.entity';
import { compare, hash } from 'bcrypt';

@Injectable()
export class LoginService {
  constructor(
    private userService: SysUserService,

    private jwtService: JwtService,
  ) {}

  async getRedisPermsById(id: number) {
    return '1';
  }

  /**
   * 创建验证码并缓存加入redis缓存
   * @param captcha 验证码长宽
   * @returns svg & id obj
   */
  async createImageCaptcha(captcha: ImageCaptchaDto) {
    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(captcha.width) ? 100 : captcha.width,
      height: isEmpty(captcha.height) ? 50 : captcha.height,
      charPreset: '1234567890',
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        'base64',
      )}`,
      id: Date.now(), // this.utils.generateUUID()
    };

    // 5分钟过期时间
    // await this.redisService
    //   .getRedis()
    //   .set(`admin:captcha:img:${result.id}`, svg.text, 'EX', 60 * 5);
    // return result;

    return result
  }

  /**
   * 校验验证码
   */
  async checkImgCaptcha(id: string, code: string) {
    return true;
    // const result = await this.redisService
    //   .getRedis()
    //   .get(`admin:captcha:img:${id}`);
    // if (isEmpty(result) || code.toLowerCase() !== result.toLowerCase()) {
    //   throw new ApiException(10002);
    // }
    // // 校验成功后移除验证码
    // await this.redisService.getRedis().del(`admin:captcha:img:${id}`);
  }

  /**
   * 获取登录JWT
   * 返回null则账号密码有误，不存在该用户
   */

  async getLoginSign(
    username: string,
    password: string,
    // ip: string,
    ua: string,
  ) {
    const user: SysUser = await this.userService.findUserByUserName(username);
    if (isEmpty(user)) {
      throw new ApiException(10003);
    }

    // 密码比对

    // 获取菜单

    return this.getToken(user)
  }

  getToken(user: SysUser) {
    return this.jwtService.sign(
      {
        uid: parseInt(user.id.toString()),
        username: user.username,
      },
      {
        expiresIn: '1d',
      },
    );
  }
  
  private async getPasswordhash(password: string): Promise<string> {
    return await hash(password, 10);
  }

  private async comparePassword(password: string, sqlPassword: string) {
    return await compare(password, sqlPassword);
  }

}
