import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { base62RandomStr } from '@/shared/utils/random';
import { UniqueCode } from '@/entities/general/unique_code.entity';
import { UrlCodeMap } from '@/entities/general/url_code_map.entity';

@Injectable()
export class ShortUrlService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,

    @InjectRepository(UrlCodeMap)
    private urlCodeMapRepositoty: Repository<UrlCodeMap>,

    @InjectRepository(UniqueCode)
    private uniqueCodeRepositoty: Repository<UniqueCode>,
  ) {}

  // 获取到原始URL
  async getLongUrl(code: string) {
    const map = await this.urlCodeMapRepositoty.findOne({
      where: { shortUrl: code },
    });

    if (!map) {
      return null;
    }
    return map.longUrl;
  }

  async generate(longUrl: string) {
    let uniqueCode = await this.uniqueCodeRepositoty.findOne({
      where: {
        status: 0,
      },
    });

    // code使用完了
    if (!uniqueCode) {
      uniqueCode = await this.generateCode();
    }

    const map = new UrlCodeMap();
    map.shortUrl = uniqueCode.code;
    map.longUrl = longUrl;

    await this.entityManager.insert(UrlCodeMap, map);
    await this.entityManager.update(
      UniqueCode,
      {
        id: uniqueCode.id,
      },
      {
        status: 1,
      },
    );
    return uniqueCode.code;
  }

  // 生成code
  async generateCode() {
    let str = base62RandomStr(6);

    const uniqueCode = await this.entityManager.findOneBy(UniqueCode, {
      code: str,
    });

    if (!uniqueCode) {
      const code = new UniqueCode();
      code.code = str;
      code.status = 0;

      return await this.entityManager.insert(UniqueCode, code);
    } else {
      return this.generateCode();
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async batchGenerateCode() {
    for (let i = 0; i < 10000; i++) {
      this.generateCode();
    }
  }
}
