import { FaceMatcher, LabeledFaceDescriptors } from "face-api.js";
import {
  FaceRecognitionModel,
} from "../models/postgres/face.recognition.model.js";
import { generateDescriptorFromImage } from "../utils/machine-learning/face-recognitions/generator-descriptor.js";
import { getDescriptorsWithCache } from "../models/redis/machine-learning/face.recognition.model.js";

const FaceRecognitionService = {
  // Fungsi untuk membuat dan menyimpan data wajah ke dalam database
  Create: async (faceData) => {
    try {
      const savedFace = await FaceRecognitionModel.create({
        data: { ...faceData },
      }); // Asumsi metode .create() tersedia
      return savedFace;
    } catch (error) {
      throw new Error("Failed to save face data: " + error.message);
    }
  },

  // Fungsi untuk mencocokkan wajah dengan gambar yang diberikan
  Match: async (username, imageBuffer) => {
    try {
      // Ambil semua data descriptor dari database
      const descriptorsFromDb = await getDescriptorsWithCache(username);
      // Pastikan data descriptor valid
      if (!Array.isArray(descriptorsFromDb) || descriptorsFromDb.length === 0) {
        throw new Error("No face descriptors found in the database.");
      }

      // Buat labeled descriptors untuk FaceMatcher
      const labeledDescriptors = descriptorsFromDb.map((item) => {
        // Validasi descriptor
        if (!Array.isArray(item.descriptor)) {
          throw new Error(`Descriptor for ${item.username} is not an array`);
        }

        if (item.descriptor.length === 0) {
          throw new Error(`Descriptor for ${item.username} is empty`);
        }

        const floatArray = new Float32Array(item.descriptor);
        return new LabeledFaceDescriptors(item.username, [floatArray]);
      });

      // Buat instance FaceMatcher dengan threshold
      const threshold = 0.6; // Sesuaikan dengan kebutuhan
      const matcher = new FaceMatcher(labeledDescriptors, threshold);

      // Generate descriptor dari gambar query
      const queryDescriptor = await generateDescriptorFromImage(imageBuffer);

      if (!queryDescriptor) {
        throw new Error("No face detected in the query image.");
      }

      // Cari best match
      const bestMatch = matcher.findBestMatch(queryDescriptor);

      // Periksa apakah distance masih di bawah threshold
      const isMatch = bestMatch.distance < threshold;

      return {
        match: isMatch ? bestMatch.label : "Unknown",
        distance: bestMatch.distance,
        isMatched: isMatch,
      };
    } catch (error) {
      throw new Error("Error during face matching: " + error.message);
    }
  },
};

export default FaceRecognitionService;
