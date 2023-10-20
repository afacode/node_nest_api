import { IsString, IsInt, Length, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(4, 12, {
        message: 'name length'
    })
    name: string;

    @IsInt()
    age: number
}
