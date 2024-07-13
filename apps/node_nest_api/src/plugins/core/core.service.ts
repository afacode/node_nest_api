import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CoreService {
  private readonly logger = new Logger(CoreService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  // 每次当前秒为 45 时都会调用 handleCron() 方法。 换句话说，该方法将在 45 秒标记处
  // @Cron('45 * * * * *')
  // handleCron() {
  //   this.logger.debug('Called when the current second is 45');
  // }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 5 seconds');
  // }

  getAllCronJob() {
    const jobs = this.schedulerRegistry.getCronJobs();
    console.log('所有Job', jobs);
    // jobs.forEach((value, key, map) => {
    //   let next;
    //   try {
    //     next = value.nextDates().toDate();
    //   } catch (e) {
    //     next = 'error: next fire date is in the past!';
    //   }
    //   this.logger.log(`job: ${key} -> next: ${next}`);
    // });
  }

  addCronJob(name: string, seconds: string) {
    if (this.isCronJobExist(name)) {
      this.logger.warn(`job ${name} is Exist!`);
    } else {
      // constructor(cronTime: CronJobParams<OC, C>['cronTime'], onTick: CronJobParams<OC, C>['onTick'], onComplete?: CronJobParams<OC, C>['onComplete'], start?: CronJobParams<OC, C>['start'], timeZone?: CronJobParams<OC, C>['timeZone'], context?: CronJobParams<OC, C>['context'], runOnInit?: CronJobParams<OC, C>['runOnInit'], utcOffset?: null, unrefTimeout?: CronJobParams<OC, C>['unrefTimeout']);
      
      const job: any = new CronJob(`${seconds} * * * * *`, () => {
        this.logger.warn(`time (${seconds}) for job ${name} to run!`);
      }, ()  => {
        console.log('onComplete')
      });

      this.schedulerRegistry.addCronJob(name, job);
      job.start();

      this.logger.warn(`job ${name} added for each minute at ${seconds} seconds!`);
    }
  }

  startCronJob(name: string) {
    if (this.isCronJobExist(name)) {
      const job = this.schedulerRegistry.getCronJob(name);
      job.start();
    } else {
      this.logger.warn(`job ${name} not find!`);
    }
  }

  stopCronJob(name: string) {
    if (this.isCronJobExist(name)) {
      const job = this.schedulerRegistry.getCronJob(name);
      job.stop();
      this.logger.warn(`job ${name} stop!`);
    } else {
      this.logger.warn(`job ${name} not find!`);
    }
  }

  deleteCronJob(name: string) {
    if (this.isCronJobExist(name)) {
      this.schedulerRegistry.deleteCronJob(name);
      this.logger.warn(`job ${name} deleted!`);
    } else {
      this.logger.warn(`job ${name} not find!`);
    }
  }

  isCronJobExist(name: string) {
    return this.schedulerRegistry.doesExist('cron', name);
  }
}
