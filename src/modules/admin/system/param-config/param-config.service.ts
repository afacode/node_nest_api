import SysConfig from '@/entities/admin/sys_config.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParamConfigDto, UpdateParamConfigDto } from './param-config.dto';
import { ApiException } from '@/common/exceptions/api.exception';

@Injectable()
export class SysParamConfigService {
  constructor(
    @InjectRepository(SysConfig)
    private configRepository: Repository<SysConfig>,
  ) {}

  /**
   * 罗列所有配置
   */
  async getConfigListByPage(page: number, size: number): Promise<SysConfig[]> {
    const list = await this.configRepository.find({
      // where: {
      //     name: Like(`%${query.keyword}%`),
      //   },
      order: {
        id: 'ASC', // DESC
      },
      take: size,
      skip: (page - 1) * size,
    });
    return list;
  }

  /**
   * 获取参数总数
   */
  async getConfigCount(): Promise<number> {
    return await this.configRepository.count();
  }

  async add(dto: CreateParamConfigDto) {
    await this.configRepository.insert(dto);
  }

  async update(dto: UpdateParamConfigDto): Promise<void>  {
    await this.configRepository.update(
      {id: dto.id},
      { name: dto.name, value: dto.value, remark: dto.remark },
    );
  }

  async delete(ids: number[]): Promise<void>  {
    await this.configRepository.delete(ids);
  }

  /**
   * 查询单个
   */
  async findOne(id: number): Promise<SysConfig> {
    return await this.configRepository.findOne({ where: { id } });
  }

  async isExistKey(key: string): Promise<void | never> {
    const result = await this.configRepository.findOne({ where: { key } });
    if (result) {
      throw new ApiException(10021);
    }
  }

  async findValueByKey(key: string): Promise<string | never> {
    const result = await this.configRepository.findOne({
      where: { key },
      select: ['value'],
    });
    if (result) {
      return result.value;
    }
    return null;
  }
}
