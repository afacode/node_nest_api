import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/index.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('用户组')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser)
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto)
    return createUserDto;
  }

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto, 'body')
    return this.userService.createUser(createUserDto);
  }

  @Get()
  setRedis() {
    return this.userService.setRedis();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
