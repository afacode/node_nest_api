import { ArgumentMetadata, BadRequestException, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class UserPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        console.log('UserPipe:', value, metadata)
        const dto = plainToInstance(metadata.metatype, value);
        console.log('dto:', dto);
        const error = await validate(dto);
        console.log('validate error:', error);
        if (error.length) {
            throw new BadRequestException('Validation failed');
            // throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
        return value
    }
}