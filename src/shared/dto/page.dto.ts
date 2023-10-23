import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class PageOptionsDto {
    @ApiProperty({default: 10, required: false})
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(1000)
    readonly pageNumber: number

    @ApiProperty({default: 1, required: false})
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(1000)
    readonly page: number
}