import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseModelWithIDPrimary } from '../base.model';

/**
 * 索引
 * UNIQUE name
 */
// 系统任务表
@Entity({ name: 'sys_task' })
export default class SysTask extends BaseModelWithIDPrimary {
  @Column({ type: 'varchar', length: 50, unique: true, comment: '任务名称' })
  @ApiProperty()
  name: string;

  @Column({comment: '需要执行的service'})
  @ApiProperty()
  service: string;

  @Column({ type: 'tinyint', default: 0, comment: '任务模式：0为cron，1为时间间隔' })
  @ApiProperty()
  type: number;

  @Column({ type: 'tinyint', default: 1, comment: '任务状态：0为停止，1为运行' })
  @ApiProperty()
  status: number;

  @Column({ name: 'start_time', type: 'datetime', nullable: true, comment: '任务开始时间，type为0时生效' })
  @ApiProperty()
  startTime: Date;

  @Column({ name: 'end_time', type: 'datetime', nullable: true, comment: '任务结束时间，type为0时生效' })
  @ApiProperty()
  endTime: Date;

  @Column({ type: 'int', nullable: true, default: 0, comment: '最大执行次数，小于或者等于0则不限次数' })
  @ApiProperty()
  limit: number;

  @Column({ nullable: true, comment: 'cron表达式，type为0时生效' })
  @ApiProperty()
  cron: string;

  @Column({ type: 'int', nullable: true, comment: '执行间隔，type为1时生效' })
  @ApiProperty()
  every: number;

  @Column({ type: 'text', nullable: true, comment: '传入数据' })
  @ApiProperty()
  data: string;

  @Column({ name: 'job_opts', type: 'text', nullable: true , comment: 'bull job options'})
  @ApiProperty()
  jobOpts: string;

  @Column({ nullable: true })
  @ApiProperty()
  remark: string;
}
