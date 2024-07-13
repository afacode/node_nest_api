import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseModelWithIDPrimary } from '../base.model';

/**
 * 索引
 * UNIQUE key
 */
// 系统参数配置表
@Entity({ name: 'sys_config' })
export default class SysConfig extends BaseModelWithIDPrimary {
  @Column({ type: 'varchar', length: 50, unique: true, comment: '参数配置键' })
  @ApiProperty()
  key: string;

  @Column({ type: 'varchar', length: 50, comment: '参数配置值' })
  @ApiProperty()
  name: string;

  @Column({ type: 'varchar', nullable: true, comment: '参数配置名称' })
  @ApiProperty()
  value: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty()
  remark: string;
}