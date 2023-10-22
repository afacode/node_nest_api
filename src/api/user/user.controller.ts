import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto, UserLoginDto } from './dto/index.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginGuard } from 'src/guard/login.guard';

@ApiTags('用户组')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser)
  }

  @Post('login')
  async userLogin(@Body()  loginUser: UserLoginDto) {
    return await this.userService.userLogin(loginUser, false)
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    return await this.userService.refresh(refreshToken, false)
  }

  @Post('/admin/login')
  async adminLogin(@Body()  loginUser: UserLoginDto) {
    return await this.userService.userLogin(loginUser, true)
  }

  @Get('/admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    return await this.userService.refresh(refreshToken, true)
  }

  @Get()
  @UseGuards(LoginGuard)
  setRedis() {
    return 1
    // return this.userService.setRedis();
  }
  
}
