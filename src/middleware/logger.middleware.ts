import { Request, Response, NextFunction } from 'express';

export function GlobalLogger(req: Request, res: Response, next: NextFunction) {
    console.log(`Request... global logger enter`);
    next();
    console.log(`Request... global logger leaver`);
  };