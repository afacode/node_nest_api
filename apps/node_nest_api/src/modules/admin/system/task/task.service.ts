import SysTask from '@/entities/admin/sys_task.entity';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { isEmpty } from 'lodash';
import { Repository } from 'typeorm';
import { SYS_TASK_QUEUE_NAME, SYS_TASK_QUEUE_PREFIX } from '../../admin.constants';
import { RedisService } from '@/shared/redis/redis.service';

@Injectable()
export class SysTaskService implements OnModuleInit {
  constructor(
    @InjectRepository(SysTask) private taskRepository: Repository<SysTask>,
    @InjectQueue(SYS_TASK_QUEUE_NAME) private taskQueue: Queue,
    private moduleRef: ModuleRef,
    private reflector: Reflector,
    private redisService: RedisService,
  ) // private logger: LoggerService,
  {}

  async onModuleInit() {
    await this.initTask();
  }

  // 初始化任务，系统启动前调用
  async initTask() {
    const initKey = `${SYS_TASK_QUEUE_PREFIX}:init`;
  }

  async page(page: number, count: number): Promise<SysTask[]> {
    const result = await this.taskRepository.find({
      order: {
        id: 'ASC',
      },
      take: count,
      skip: (page - 1) * count,
    });
    return result;
  }

  async count(): Promise<number> {
    return await this.taskRepository.count();
  }

  async info(id: number): Promise<SysTask> {
    return await this.taskRepository.findOne({ where: { id } });
  }



  // 更新是否已经完成，完成则移除该任务并修改状态
  async updateTaskCompleteStatus(tid: number): Promise<void> {
    
  }



  /**
   * 根据serviceName调用service，例如 SysLogService.clearReqLog
   */
  async callService(serviceName: string, args: string): Promise<void> {

  }






}
