import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User)  private readonly user: Repository<User>) {}

  create(createUserDto: CreateUserDto) {
    return '----';
  }

  findAll() {
    return this.user.find();
  }

  private async getPasswordhash(password: string): Promise<string> {
    return await hash(password, 10);
  }

  private async comparePassword(password: string, user:  User) {
    return  await compare(password,  user.password)
  }

  async createUser(createUserDto: CreateUserDto) {
    const hash = await this.getPasswordhash(createUserDto.password)

    const res  = await this.user.save({
      name: createUserDto.name,
      mobile: createUserDto.mobile,
      password: hash
    })
    return  {id: res.id}
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
