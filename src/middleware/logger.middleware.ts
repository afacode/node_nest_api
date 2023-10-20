import { Request, Response, NextFunction, query } from 'express';

export function GlobalLogger(req: Request, res: Response, next: NextFunction) {
    console.log('url:',req.url, 'query:', req.query, 'params:', req.params, 'body:', req.body);
    next();
  };