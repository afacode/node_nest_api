import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class Log  implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('logger-----')
        next()
    }
}