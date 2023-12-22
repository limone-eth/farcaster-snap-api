import 'dotenv/config';
import { init } from '@airstack/node';
import express from 'express';

import { farcasterFollowsInCommon } from './api/airstack';
import { authCheck, getNonce, signIn } from './api/auth';
import { authenticate } from './middleware';

init(process.env.AIRSTACK_API_KEY as string);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add headers before the routes are defined
app.use((_req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-address');

  // Pass to next layer of middleware
  next();
});

app.get('/auth/nonce', getNonce);

app.post('/auth/sign-in', signIn);

app.get('/auth/check', authenticate, authCheck);

app.get('/airstack/farcaster-follows', authenticate, farcasterFollowsInCommon);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
