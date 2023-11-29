import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UAParser } from 'ua-parser-js';
import { LoginLogInfo, TaskLogInfo } from './log.class';
import SysLoginLog from '@/entities/admin/sys_login_log.entity';
import SysUser from '@/entities/admin/sys_user.entity';
import { UtilService } from '@/shared/services/util.service';
import SysTaskLog from '@/entities/admin/sys_task_log.entity';

@Injectable()
export class SysLogService {
  constructor(
    @InjectRepository(SysLoginLog)
    private loginLogRepository: Repository<SysLoginLog>,
    @InjectRepository(SysTaskLog)
    private taskLogRepository: Repository<SysTaskLog>,
    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>,
    private readonly utilService: UtilService,
  ) {}

  // 记录登录日志
  async saveLoginLog(uid: number, ip: string, ua: string) {
    const loginLocation = await this.utilService.getLocation(ip.split(',').at(-1).trim());
    await this.loginLogRepository.save({
      ip,
      loginLocation,
      userId: uid,
      ua,
    });
  }

  /**
   * 计算登录日志日志总数
   */
  async countLoginLog(): Promise<number> {
    const userIds = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id'])
      .getMany();
    return await this.loginLogRepository.count({
      where: { userId: In(userIds.map((n) => n.id)) },
    });
  }
  //   分页加载日志信息
  async pageGetLoginLog(page: number, count: number) {
    // const result = await this.loginLogRepository.find({
    //   where: {},
    //   take: count,
    //   skip: (page - 1) * count,
    //   order: {
    //     updatedAt: 'DESC',
    //   },
    // });
    // sys_login_log as login_log   sys_user as  user
    const result = await this.loginLogRepository
      .createQueryBuilder('login_log')
      .innerJoinAndSelect('sys_user', 'user', 'login_log.user_id = user.id')
      // .leftJoinAndSelect('sys_user', 'user', 'login_log.user_id = user.id')
      .offset((page - 1) * count)
      .limit(count)
      .getRawMany();
      
    const parser = new UAParser();
    return result.map((e: any) => {
      const u = parser.setUA(e.login_log_ua).getResult();
      return {
        id: e.login_log_id,
        ip: e.login_log_ip,
        os: `${u.os.name} ${u.os.version}`,
        browser: `${u.browser.name} ${u.browser.version}`,
        time: e.login_log_created_at,
        username: e.user_username,
        loginLocation: e.login_log_login_location,
      };
    });
  }

  /**s
   * 分页加载日志信息
   */
  async page(page: number, count: number): Promise<TaskLogInfo[]> {
    const result = await this.taskLogRepository
      .createQueryBuilder('task_log')
      .leftJoinAndSelect('sys_task', 'task', 'task_log.task_id = task.id')
      .orderBy('task_log.id', 'DESC')
      .offset((page - 1) * count)
      .limit(count)
      .getRawMany();
    return result.map((e) => {
      return {
        id: e.task_log_id,
        taskId: e.task_id,
        name: e.task_name,
        createdAt: e.task_log_created_at,
        consumeTime: e.task_log_consume_time,
        detail: e.task_log_detail,
        status: e.task_log_status,
      };
    });
  }

  /**
   * 计算日志总数
   */
  async countTaskLog(): Promise<number> {
    return await this.taskLogRepository.count();
  }
}
