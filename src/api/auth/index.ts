import crypto from 'crypto';

import { Request, Response } from 'express';
import { verifyMessage } from 'viem';

import { AUTH_MESSAGE, buildMessage } from './utils';

import redis from '../../redis';

export const getNonce = async (_req: Request, res: Response) => {
  // random int number between 0 and 1000
  const nonce = crypto.randomInt(111111, 999999);
  res.json({
    nonce,
    message: `${AUTH_MESSAGE}${nonce}`,
  });
};

export const signIn = async (req: Request, res: Response) => {
  // the address and signed message from the client
  const { address, signature, nonce } = req.body;

  // verify the signature
  const message = buildMessage(nonce);

  const isVerified = verifyMessage({
    address,
    message,
    signature,
  });

  if (!isVerified) {
    return res.status(401).json({
      error: 'Authentication Failed: Invalid signature',
    });
  }

  await redis.set(address.toLowerCase(), 1);

  return res.status(200).json({
    message: 'Authentication successful',
  });
};

export const authCheck = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Address has been correctly authenticated',
  });
};
