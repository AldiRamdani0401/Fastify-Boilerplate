import { redisNativeClient } from "../index.js";

const FaceRecognitionRepository = {
  save: async ({ username, descriptor }) => {
    const key = `FaceRecognition:${username}`;
    await redisNativeClient.hSet(key, {
      username,
      descriptor: JSON.stringify(descriptor),
      createdAt: new Date().toISOString(),
    });
  },

  saveMany: async (dataArray) => {
    for (const item of dataArray) {
      const descriptor = Array.isArray(item.descriptor)
        ? item.descriptor
        : JSON.parse(item.descriptor || "[]");

      await FaceRecognitionRepository.save({
        username: item.username,
        descriptor,
      });
    }
  },

  getAll: async () => {
    const keys = await redisNativeClient.keys("FaceRecognition:*");
    const data = [];

    for (const key of keys) {
      const record = await redisNativeClient.hGetAll(key);
      const descriptor = Array.isArray(record.descriptor)
        ? record.descriptor
        : JSON.parse(record.descriptor || "[]");

      data.push({
        username: record.username,
        descriptor,
        createdAt: record.createdAt,
      });
    }

    return data;
  },

  getOne: async (username) => {
    const key = `FaceRecognition:${username}`;
    const record = await redisNativeClient.hGetAll(key);

    if (!record || Object.keys(record).length === 0) return null;

    const descriptor = Array.isArray(record.descriptor)
      ? record.descriptor
      : JSON.parse(record.descriptor || "[]");

    return {
      username: record.username,
      descriptor,
      createdAt: record.createdAt,
    };
  },
};

export default FaceRecognitionRepository;
