import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";
import { loadModels } from "../utils/machine-learning/face-recognitions/face-api-init.js";
import { FaceRecognitionModel } from "../models/postgres/face.recognition.model.js";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const THRESHOLD = 0.6;

// Load models once on app startup
await loadModels();

const FaceRecognitionService = {
  Create: async (data) => {
    const { username, descriptor } = data;

    const saved = await FaceRecognitionModel.create({
      data: {
        username,
        descriptor,
      },
    });

    return saved;
  },
  Match: async (imageBuffer) => {
    const img = await canvas.loadImage(imageBuffer);
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) throw new Error("Wajah tidak terdeteksi!");

    const inputDescriptor = Array.from(detection.descriptor);

    // Ambil semua data dari DB
    const faces = await FaceRecognitionModel.findMany();

    if (!faces.length) throw new Error("Tidak ada data wajah di database!");

    // Bandingkan semua
    let bestMatch = null;
    let minDistance = Infinity;

    faces.forEach((face) => {
      const distance = faceapi.euclideanDistance(
        inputDescriptor,
        face.descriptor
      );
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = {
          username: face.username,
          distance,
        };
      }
    });

    if (minDistance > THRESHOLD) {
      return {
        match: false,
        message: "Wajah tidak dikenali",
        distance: minDistance,
      };
    }

    return {
      match: true,
      username: bestMatch.username,
      distance: minDistance,
    };
  },
};

export default FaceRecognitionService;
