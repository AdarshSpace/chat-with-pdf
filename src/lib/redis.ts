import IORedis from "bullmq/node_modules/ioredis";

const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

export { redis };


