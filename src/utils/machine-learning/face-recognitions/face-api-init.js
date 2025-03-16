import * as tf from "@tensorflow/tfjs";
import * as faceapi from "@vladmandic/face-api";
import path from "path";

export const loadModels = async () => {
  // Set backend 'cpu' karena default-nya bisa saja 'webgl' atau 'tensorflow' (yang sekarang tidak tersedia)
  await tf.setBackend("cpu");
  await tf.ready();

  const modelPath = path.join(process.cwd(), "src/utils/machine-learning/face-recognitions/models");

  // Load models from disk
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);

  console.log("✅ Face API models loaded successfully");
};
