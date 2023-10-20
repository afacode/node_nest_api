import { ApiProperty } from "@nestjs/swagger";

export class CreateGuardDto {
    @ApiProperty({example: 'afacode'})
    name: string

    @ApiProperty({example: 18})
    age: number
}
