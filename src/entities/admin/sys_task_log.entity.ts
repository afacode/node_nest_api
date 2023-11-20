import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseModelWithIDPrimary } from '../base.model';


@Entity({ name: 'sys_task_log' })
export default class SysTaskLog extends BaseModelWithIDPrimary {
  @Column({ name: 'task_id', comment: '对应任务id' })
  @ApiProperty()
  taskId: number;

  @Column({ type: 'tinyint', default: 0, comment: '任务状态：0为失败，1为成功' })
  @ApiProperty()
  status: number;

  @Column({ type: 'text', nullable: true, comment: '任务详情' })
  @ApiProperty()
  detail: string;

  @Column({ type: 'int', nullable: true, name: 'consume_time', default: 0, comment: '任务完成耗时 (ms)' })
  @ApiProperty()
  consumeTime: number;
}
