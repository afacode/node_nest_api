import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import { Request } from 'express';

@Injectable()
export class UtilService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * 获取请求IP
   */
  getReqIP(req: Request): string {
    return (
      // 判断是否有反向代理 IP
      (
        (req.headers['x-forwarded-for'] as string) ||
        // 判断后端的 socket 的 IP
        req.socket.remoteAddress
      ).replace('::ffff:', '')
    );
  }

  /* 判断IP是不是内网 */
  IsLAN(ip: string) {
    ip.toLowerCase();
    if (ip == 'localhost') return true;
    let a_ip = 0;
    if (ip == '') return false;
    const aNum = ip.split('.');
    if (aNum.length != 4) return false;
    a_ip += parseInt(aNum[0]) << 24;
    a_ip += parseInt(aNum[1]) << 16;
    a_ip += parseInt(aNum[2]) << 8;
    a_ip += parseInt(aNum[3]) << 0;
    a_ip = (a_ip >> 16) & 0xffff;
    return (
      a_ip >> 8 == 0x7f || a_ip >> 8 == 0xa || a_ip == 0xc0a8 || (a_ip >= 0xac10 && a_ip <= 0xac1f)
    );
  }
  /* 通过ip获取地理位置 */
  async getLocation(ip: string) {
    if (this.IsLAN(ip)) return '内网IP';

    let { data } = await this.httpService.axiosRef.get(
      `http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`,
      { responseType: 'arraybuffer' },
    );

    data = new TextDecoder('gbk').decode(data);
    data = JSON.parse(data);
    return data.addr.trim().split(' ').at(0);
  }

  public generateUUID(): string {
    return uuidv4();
  }

  public async getHash(password: string): Promise<string> {
    return await hash(password, 10);
  }

  public async compareHash(password: string, sqlPassword: string) {
    return await compare(password, sqlPassword);
  }

  /**
   * AES加密
   */
  public aesEncrypt(msg: string, secret: string): string {
    return CryptoJS.AES.encrypt(msg, secret).toString();
  }

  /**
   * AES解密
   */
  public aesDecrypt(encrypted: string, secret: string): string {
    return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8);
  }

  /**
   * md5加密
   */
  public md5(msg: string): string {
    return CryptoJS.MD5(msg).toString();
  }

  /**
   * 生成一个随机的值
   */
  public generateRandomValue(
    length: number = 8,
    placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
  ): string {
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomPoz = Math.floor(Math.random() * placeholder.length);
      randomString += placeholder.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  }
}
