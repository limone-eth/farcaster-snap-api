import { Request, Response, NextFunction } from 'express';

import redis from './redis';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const { headers } = req;
  const xAddress = headers['x-address'] as string;
  const address = await redis.get(xAddress.toLowerCase());
  if (!address) {
    res.status(401).json({
      error: 'Authentication Failed: Invalid address',
    });
  } else {
    next();
  }
};
