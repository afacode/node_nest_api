import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto, UserLoginDto } from './dto/index.dto';
import { RedisService } from 'src/plugins/redis/redis.service';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private logger = new Logger();

  @Inject(RedisService)
  redisService: RedisService;

  @Inject(JwtService)
  jwtService: JwtService;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    private configService: ConfigService,
  ) {}

  async register(registerUser: RegisterUserDto) {
    console.log(registerUser, 'registerUser');
    const captcha = await this.redisService.get(`captcha_${registerUser.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (captcha !== registerUser.captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const u = await this.userRepository.findOneBy({ username: registerUser.username });

    if (u) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    const hash = await this.getPasswordhash(registerUser.password);
    newUser.username = registerUser.username;
    newUser.password = hash;
    newUser.email = registerUser.email;
    newUser.nikeName = registerUser.nikeName;

    try {
      await this.userRepository.save(newUser);
      return 'register success';
    } catch (error) {
      this.logger.error(error, UserService);
      return 'register fail';
    }
  }

  async userLogin(loginUser: UserLoginDto, isAdmin: boolean) {
    const findOne = await this.userRepository.findOne({
      where: { username: loginUser.username, isAdmin: isAdmin },
      relations: ['roles', 'roles.permissions'],
    });

    if (!findOne) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const isPass = await this.comparePassword(loginUser.password, findOne.password);
    if (!isPass) {
      throw new HttpException('密码不正确', HttpStatus.BAD_REQUEST);
    }

    const accessToken = this.getToken(findOne);

    const refreshToken = this.jwtService.sign(
      {
        userId: findOne.id,
      },
      {
        expiresIn: '7d',
      },
    );

    return { ...findOne, accessToken, refreshToken };
  }

  getToken(user: User) {
    return this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
        roles: user.roles,
      },
      {
        expiresIn: '1d',
      },
    );
  }

  async refresh(token: string, isAdmin: boolean) {
    const data = this.jwtService.verify(token);
    console.log(data);
    const user = await this.findUserById(data.userId, isAdmin);
    const accessToken = this.getToken(user);
    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        expiresIn: '7d',
      },
    );
    return { accessToken, refreshToken };
  }

  async findUserById(userId: string, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin: isAdmin,
      },
    });
    return user;
  }

  async setRedis() {
    //  await this.redisService.set('test_key1', +new Date())
    return 'ssss';
  }

  private async getPasswordhash(password: string): Promise<string> {
    return await hash(password, 10);
  }

  private async comparePassword(password: string, sqlPassword: string) {
    return await compare(password, sqlPassword);
  }

  async findRoleById(ids: string[]) {
    console.log(ids);

    // const roles = await this.roleRepository.findOne({where: {id:  ids[0]},
    //   relations: ['permissions']})

    const roles = await this.roleRepository.find({
      where: {
        id: In(ids),
      },
      relations: ['permissions'],
    });
    return roles;
  }
}
