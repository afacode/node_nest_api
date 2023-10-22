import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './dto/index.dto';
import { RedisService } from 'src/plugins/redis/redis.service';

@Injectable()
export class UserService {
  private logger = new Logger()

  @Inject(RedisService)
  redisService: RedisService
  
  constructor(
    @InjectRepository(User)  private readonly user: Repository<User>,
    private configService: ConfigService
  ) {}


  async register(registerUser: RegisterUserDto) {
    console.log(registerUser,  'registerUser')
    const captcha  = await this.redisService.get(`captcha_${registerUser.email}`)

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST)
    }

    if (captcha !== registerUser.captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST)
    }

    const u = await this.user.findOneBy({username: registerUser.username})

    if (u) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST)
    }

    const newUser = new User()
    const hash = await this.getPasswordhash(registerUser.password)
    newUser.username = registerUser.username
    newUser.password = hash
    newUser.email = registerUser.email
    newUser.nikeName = registerUser.nikeName

    try {
      await this.user.save(newUser)
      return 'register success'
    } catch (error) {
      this.logger.error(error, UserService)
      return 'register fail'
    }
  }

  async setRedis() {
     await this.redisService.set('test_key1', +new Date())
     return 'set sucess'
  }

  create(createUserDto: CreateUserDto) {
    return '----';
  }

  findAll() {
    console.log(this.configService.get<string>('DB_PORT'))
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
      phoneNumber: createUserDto.phoneNumber,
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
