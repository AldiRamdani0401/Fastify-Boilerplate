import { getDescriptorsFromDatabase } from "../../postgres/face.recognition.model.js";
import FaceRecognitionRepository from "./face.recognition.redis.js";

export const getDescriptorsWithCache = async (username = null) => {
  try {
    if (username) {
      // Cek apakah Redis punya data spesifik user
      const key = `FaceRecognition:${username}`;
      const record = await FaceRecognitionRepository.getOne(username); // fungsi getOne perlu ditambahkan di bawah

      if (record && record.descriptor?.length > 0) {
        console.info(`✅ Descriptor for ${username} found in Redis.`);
        return [record]; // kembalikan dalam bentuk array agar tetap konsisten format
      }

      // Kalau tidak ada, ambil dari PostgreSQL
      console.info(
        `ℹ️ Redis cache miss for ${username}. Fetching from PostgreSQL...`
      );
      const dbData = await getDescriptorsFromDatabase(username);

      // Simpan ke Redis
      await FaceRecognitionRepository.saveMany(dbData);

      return dbData;
    } else {
      // Ambil semua dari Redis
      const redisData = await FaceRecognitionRepository.getAll();

      if (redisData && redisData.length > 0) {
        console.info("✅ Found descriptors in Redis (all).");
        return redisData;
      }

      // Kalau Redis kosong, ambil semua dari PostgreSQL
      console.info("ℹ️ Redis cache empty. Fetching all from PostgreSQL...");
      const dbData = await getDescriptorsFromDatabase();

      // Simpan semua ke Redis
      await FaceRecognitionRepository.saveMany(dbData);

      return dbData;
    }
  } catch (error) {
    throw new Error(
      "Failed to retrieve descriptors with cache: " + error.message
    );
  }
};
