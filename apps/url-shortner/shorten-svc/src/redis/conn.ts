import Redis from "ioredis";

export const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1", // Default Redis host
    port: Number(process.env.REDIS_PORT) || 6379, // Default Redis port
  });

