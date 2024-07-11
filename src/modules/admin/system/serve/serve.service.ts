import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';
import { Disk, ServeStatInfo } from './serve.dto';
import * as os from 'node:os';
import * as nodeDiskInfo from 'node-disk-info';

@Injectable()
export class SysServeService {
  /**
   * 获取服务器信息
   */
  async getServeStat(): Promise<ServeStatInfo> {
    const versions = await si.versions('node, npm');
    const osinfo = await si.osInfo();
    const cpuinfo = await si.cpu();
    const currentLoadinfo = await si.currentLoad();

    // 计算总空间
    const diskListInfo = await si.fsSize();
    const diskinfo = new Disk();
    diskinfo.size = diskListInfo[0].size;
    diskinfo.available = diskListInfo[0].available;
    diskinfo.used = 0;
    diskListInfo.forEach((d) => {
      diskinfo.used += d.used;
    });

    const meminfo = await si.mem();

    return {
      runtime: {
        npmVersion: versions.npm,
        nodeVersion: versions.node,
        os: osinfo.platform,
        arch: osinfo.arch,
      },
      cpu: {
        manufacturer: cpuinfo.manufacturer,
        brand: cpuinfo.brand,
        physicalCores: cpuinfo.physicalCores,
        model: cpuinfo.model,
        speed: cpuinfo.speed,
        rawCurrentLoad: currentLoadinfo.rawCurrentLoad,
        rawCurrentLoadIdle: currentLoadinfo.rawCurrentLoadIdle,
        coresLoad: currentLoadinfo.cpus.map((e) => {
          return {
            rawLoad: e.rawLoad,
            rawLoadIdle: e.rawLoadIdle,
          };
        }),
      },
      disk: diskinfo,
      memory: {
        total: meminfo.total,
        available: meminfo.available,
      },
    };
  }

  async getServeAllStatus() {
    return {
      cpu: this.getCpuInfo(),
      memeory: this.getMemoryInfo(),
      dist: await this.getDiskStatus(),
      sys: this.getSysInfo()
    }
  }

  getSysInfo() {
    return {
      computerName: os.hostname(),
      computerIp: this.getServerIP(),
      osName: os.platform(),
      osArch: os.arch(),
    };
  }

  getServerIP() {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  }

  async getDiskStatus() {
    const disks = await nodeDiskInfo.getDiskInfoSync();
    console.log(disks);
    const sysFiles = disks.map((disk: any) => {
      return {
        dirName: disk._mounted,
        typeName: disk._filesystem,
        total: this.bytesToGB(disk._blocks) + 'GB',
        used: this.bytesToGB(disk._used) + 'GB',
        free: this.bytesToGB(disk._available) + 'GB',
        usage: ((disk._used / disk._blocks || 0) * 100).toFixed(2),
      };
    });
    return sysFiles;
  }

  bytesToGB(bytes) {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2);
  }

  getMemoryInfo() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercentage = (((totalMemory - freeMemory) / totalMemory) * 100).toFixed(2);
    const mem = {
      total: this.bytesToGB(totalMemory),
      used: this.bytesToGB(usedMemory),
      free: this.bytesToGB(freeMemory),
      usage: memoryUsagePercentage
    };
    return mem;
  }

  getCpuInfo() {
    const cpus = os.cpus();
    const cpuInfo = cpus.reduce(
      (info, cpu) => {
        info.cpuNum += 1;
        info.user += cpu.times.user;
        info.sys += cpu.times.sys;
        info.idle += cpu.times.idle;
        info.total += cpu.times.user + cpu.times.sys + cpu.times.idle;
        return info;
      },
      { user: 0, sys: 0, idle: 0, total: 0, cpuNum: 0 },
    );
    const cpu = {
      cpuNum: cpuInfo.cpuNum,
      sys: ((cpuInfo.sys / cpuInfo.total) * 100).toFixed(2),
      used: ((cpuInfo.user / cpuInfo.total) * 100).toFixed(2),
      free: ((cpuInfo.idle / cpuInfo.total) * 100).toFixed(2),
    };
    return cpu;
  }

}
