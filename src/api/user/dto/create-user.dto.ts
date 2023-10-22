import { IsString, IsInt, Length, IsNotEmpty, IsMobilePhone, Matches, IsEmpty } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 12, {
        message: 'name length'
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    rePassword: string

    @IsMobilePhone('zh-CN')
    phoneNumber: string
}
