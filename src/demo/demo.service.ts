import { Injectable } from '@nestjs/common';
import { CreateDemoDto, QueryDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Demo } from './entities/demo.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class DemoService {
  constructor(@InjectRepository(Demo) private readonly demo: Repository<Demo>) {}
  create(createDemoDto: CreateDemoDto) {
    const data = new Demo();
    data.name = createDemoDto.name;
    data.password = createDemoDto.password;
    return this.demo.save(data);
  }

  async findAll(query: QueryDto) {
    const data = await this.demo.find({
      where: {
        name: Like(`%${query.keyword}%`),
      },
      order: {
        id: 'DESC',
      },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    });

    const total = await this.demo.count({
      where: {
        name: Like(`%${query.keyword}%`),
      },
    });

    return {
      list: data,
      total,
    };
  }

  findOne(id: number) {
    return this.demo.find({
      where: {
        id,
      },
    });
  }

  update(id: number, updateDemoDto: UpdateDemoDto) {
    return this.demo.update(id, updateDemoDto);
  }

  remove(id: number) {
    return this.demo.delete(id);
  }
}
