// src/models/redis/index.js
import { createClient } from "redis";

export const redisNativeClient = createClient({
  url: "redis://localhost:6379",
});

export const connectRedis = async () => {
  if (!redisNativeClient.isOpen) {
    await redisNativeClient.connect();
    console.log("✅ Redis Connected (Native Client)");
  }
};
