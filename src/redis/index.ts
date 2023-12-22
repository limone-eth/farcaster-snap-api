import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_CONNECTION_STRING);

export default redis;
