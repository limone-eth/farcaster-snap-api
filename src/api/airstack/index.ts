import { Request, Response } from 'express';

import { getFarcasterFollowsInCommon } from '../../airstack/farcaster-follows';

export const farcasterFollowsInCommon = async (req: Request, res: Response) => {
  const { addressA, addressB } = req.query;
  console.log(req.query, addressA, addressB);
  try {
    const result = await getFarcasterFollowsInCommon(addressA as string, addressB as string);
    res.json({
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: 'There was an error fetching the data.',
    });
  }
};
